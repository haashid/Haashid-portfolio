"use client";

import { useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { adminRequest } from "@/lib/admin-client";

type Skill = { id: string; name: string; categoryId: string; iconName: string | null; level: string | null; featured: boolean; displayOrder: number; publishStatus: string };
type Category = { id: string; name: string; displayOrder: number; skills: Skill[] };

export function SkillsManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategories[0]?.id ?? "");
  const [iconName, setIconName] = useState("");
  const [level, setLevel] = useState("");
  const [editing, setEditing] = useState<Skill | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function createCategory() {
    const categoryName = window.prompt("New skill category name")?.trim();
    if (!categoryName) return;
    setError("");
    try {
      const category = await adminRequest<Category>("/api/admin/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "category", name: categoryName, displayOrder: categories.length }) });
      setCategories((items) => [...items, { ...category, skills: [] }]);
      if (!categoryId) setCategoryId(category.id);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not create the category."); }
  }

  async function createSkill(event: React.FormEvent) {
    event.preventDefault();
    if (!categoryId) { setError("Create or select a category first."); return; }
    setPending(true); setError("");
    try {
      const saved = await adminRequest<Skill>("/api/admin/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, categoryId, iconName: iconName || null, level: level || null, displayOrder: categories.find((category) => category.id === categoryId)?.skills.length ?? 0, publishStatus: "PUBLISHED" }) });
      setCategories((items) => items.map((category) => category.id === categoryId ? { ...category, skills: [...category.skills, saved] } : category));
      setName(""); setIconName(""); setLevel("");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save the skill."); }
    finally { setPending(false); }
  }

  function beginEdit(skill: Skill) { setEditing({ ...skill }); setError(""); }

  async function saveEdit() {
    if (!editing) return;
    setPending(true); setError("");
    try {
      const saved = await adminRequest<Skill>(`/api/admin/skills/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: editing.name, categoryId: editing.categoryId, iconName: editing.iconName || null, level: editing.level || null, featured: editing.featured, displayOrder: editing.displayOrder, publishStatus: editing.publishStatus }) });
      setCategories((items) => items.map((category) => ({ ...category, skills: category.skills.filter((skill) => skill.id !== saved.id) })).map((category) => category.id === saved.categoryId ? { ...category, skills: [...category.skills, saved].sort((a, b) => a.displayOrder - b.displayOrder) } : category));
      setEditing(null);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not update the skill."); }
    finally { setPending(false); }
  }

  async function archive(skill: Skill) {
    if (!window.confirm(`Archive “${skill.name}”?`)) return;
    setPending(true); setError("");
    try {
      await adminRequest(`/api/admin/skills/${skill.id}`, { method: "DELETE" });
      setCategories((items) => items.map((category) => ({ ...category, skills: category.skills.filter((item) => item.id !== skill.id) })));
      if (editing?.id === skill.id) setEditing(null);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not archive the skill."); }
    finally { setPending(false); }
  }

  return (
    <div>
      <div className="admin-page-header"><div><h1 className="admin-page-title">Skills</h1><p className="admin-page-desc">Manage published skills and their categories.</p></div><button className="admin-btn admin-btn-secondary" onClick={createCategory}><Plus size={15} /> Add Category</button></div>
      {error && <p role="alert" className="admin-error">{error}</p>}
      <form className="admin-card" onSubmit={createSkill}>
        <h2 className="admin-card-title">Add a skill</h2>
        <div className="admin-form-grid">
          <label className="admin-field">Name<input className="admin-input" required value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label className="admin-field">Category<select className="admin-select" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label className="admin-field">Icon name<input className="admin-input" value={iconName} onChange={(event) => setIconName(event.target.value)} /></label>
          <label className="admin-field">Level<select className="admin-select" value={level} onChange={(event) => setLevel(event.target.value)}><option value="">Not specified</option>{["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"].map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <button className="admin-btn admin-btn-primary" type="submit" disabled={pending || !name.trim() || !categoryId}><Plus size={14} /> Add Skill</button>
      </form>
      {categories.length === 0 && <div className="admin-empty"><h3>No skill categories</h3><p>Create a category before adding skills.</p></div>}
      {categories.map((category) => <section key={category.id} className="admin-card"><div className="admin-card-header"><h2 className="admin-card-title">{category.name}</h2><span>{category.skills.length} skills</span></div><div className="admin-skill-list">{category.skills.map((skill) => <div key={skill.id} className="admin-skill-row"><span>{skill.name}{skill.level && <small>{skill.level.toLowerCase()}</small>}</span><div><button className="admin-btn-icon" title={`Edit ${skill.name}`} onClick={() => beginEdit(skill)}><Pencil size={14} /></button><button className="admin-btn-icon" title={`Archive ${skill.name}`} disabled={pending} onClick={() => archive(skill)}><Trash2 size={14} /></button></div></div>)}</div></section>)}
      {editing && <div className="modal-backdrop" role="presentation"><section className="admin-card" role="dialog" aria-modal="true" aria-labelledby="edit-skill-title" style={{ width: "min(520px, calc(100vw - 32px))", margin: "auto" }}><div className="admin-card-header"><h2 id="edit-skill-title" className="admin-card-title">Edit skill</h2><button className="admin-btn-icon" onClick={() => setEditing(null)} aria-label="Cancel edit"><X size={16} /></button></div><div className="admin-form-grid"><label className="admin-field">Name<input className="admin-input" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} /></label><label className="admin-field">Category<select className="admin-select" value={editing.categoryId} onChange={(event) => setEditing({ ...editing, categoryId: event.target.value })}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="admin-field">Icon<input className="admin-input" value={editing.iconName || ""} onChange={(event) => setEditing({ ...editing, iconName: event.target.value })} /></label><label className="admin-field">Level<select className="admin-select" value={editing.level || ""} onChange={(event) => setEditing({ ...editing, level: event.target.value || null })}><option value="">Not specified</option>{["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"].map((item) => <option key={item}>{item}</option>)}</select></label><label className="admin-field">Display order<input className="admin-input" type="number" value={editing.displayOrder} onChange={(event) => setEditing({ ...editing, displayOrder: Number(event.target.value) })} /></label><label className="admin-field">Visibility<select className="admin-select" value={editing.publishStatus} onChange={(event) => setEditing({ ...editing, publishStatus: event.target.value })}><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option></select></label><label><input type="checkbox" checked={editing.featured} onChange={(event) => setEditing({ ...editing, featured: event.target.checked })} /> Featured</label></div><div className="admin-form-actions"><button className="admin-btn admin-btn-secondary" onClick={() => setEditing(null)}>Cancel</button><button className="admin-btn admin-btn-primary" disabled={pending || !editing.name.trim()} onClick={saveEdit}><Save size={14} /> Save</button></div></section></div>}
    </div>
  );
}

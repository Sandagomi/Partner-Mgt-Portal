import { useState } from "react";
import { useStore } from "@/lib/store";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchBar } from "@/components/SearchBar";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, Building2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Partner } from "@/lib/types";

const emptyForm = { name: "", email: "", username: "", password: "", address: "", contact: "" };

export default function PartnersPage() {
  const { partners, brands, addPartner, updatePartner, deletePartner } = useStore();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = partners.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: Partner) => { setEditing(p); setForm({ name: p.name, email: p.email, username: p.username, password: p.password, address: p.address, contact: p.contact || "" }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.username.trim() || !form.password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (editing) {
      updatePartner(editing.id, form);
      toast.success("Partner updated");
    } else {
      addPartner(form);
      toast.success("Partner created");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePartner(deleteId);
      toast.success("Partner deleted");
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: "Partners" }]} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Partners</h1>
        <Button onClick={openCreate} className="gradient-brand text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />Add Partner
        </Button>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search partners..." />
      </div>

      <div className="bg-card rounded-lg border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Brands</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No partners found</TableCell></TableRow>
            ) : filtered.map((p) => (
              <TableRow key={p.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    {p.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.email}</TableCell>
                <TableCell className="text-muted-foreground">{p.contact || "—"}</TableCell>
                <TableCell>
                  <Link to={`/brands?partnerId=${p.id}`} className="text-primary hover:underline text-sm flex items-center gap-1">
                    {brands.filter(b => b.partnerId === p.id).length} brands <ChevronRight className="h-3 w-3" />
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Partner" : "Add Partner"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Partner Name *</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Username *</Label><Input value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} /></div>
              <div className="grid gap-2"><Label>Password *</Label><Input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} /></div>
            </div>
            <div className="grid gap-2"><Label>Address *</Label><Input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Contact Number</Label><Input value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gradient-brand text-primary-foreground">{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Partner"
        description="This will also delete all associated brands, sub brands, and table configurations."
      />
    </div>
  );
}

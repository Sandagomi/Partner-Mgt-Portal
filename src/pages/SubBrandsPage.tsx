import { useState } from "react";
import { useStore } from "@/lib/store";
import { useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchBar } from "@/components/SearchBar";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Layers, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SubBrand } from "@/lib/types";

const emptyForm = { brandId: "", name: "", location: "", address: "", contact: "" };

export default function SubBrandsPage() {
  const { partners, brands, subBrands, tables, addSubBrand, updateSubBrand, deleteSubBrand } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterBrandId = searchParams.get("brandId") || "";
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<SubBrand | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = subBrands
    .filter((sb) => !filterBrandId || sb.brandId === filterBrandId)
    .filter((sb) => sb.name.toLowerCase().includes(search.toLowerCase()) || sb.location.toLowerCase().includes(search.toLowerCase()));

  const filterBrand = brands.find(b => b.id === filterBrandId);
  const filterPartner = filterBrand ? partners.find(p => p.id === filterBrand.partnerId) : null;

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, brandId: filterBrandId }); setDialogOpen(true); };
  const openEdit = (sb: SubBrand) => { setEditing(sb); setForm({ brandId: sb.brandId, name: sb.name, location: sb.location, address: sb.address, contact: sb.contact }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.brandId || !form.name.trim() || !form.location.trim() || !form.address.trim()) {
      toast.error("Please fill in all required fields"); return;
    }
    if (editing) { updateSubBrand(editing.id, form); toast.success("Sub brand updated"); }
    else { addSubBrand(form); toast.success("Sub brand created"); }
    setDialogOpen(false);
  };

  const handleDelete = () => { if (deleteId) { deleteSubBrand(deleteId); toast.success("Sub brand deleted"); setDeleteId(null); } };

  const breadcrumbs = filterBrand && filterPartner
    ? [{ label: "Partners", href: "/partners" }, { label: filterPartner.name }, { label: "Brands", href: `/brands?partnerId=${filterPartner.id}` }, { label: filterBrand.name }, { label: "Sub Brands" }]
    : [{ label: "Sub Brands" }];

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{filterBrand ? `${filterBrand.name} — Sub Brands` : "All Sub Brands"}</h1>
        <Button onClick={openCreate} className="gradient-brand text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Add Sub Brand</Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="max-w-sm flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search sub brands..." /></div>
        {!filterBrandId && (
          <Select value={filterBrandId} onValueChange={(v) => setSearchParams(v ? { brandId: v } : {})}>
            <SelectTrigger className="w-48 bg-card"><SelectValue placeholder="All Brands" /></SelectTrigger>
            <SelectContent>{brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
          </Select>
        )}
      </div>

      <div className="bg-card rounded-lg border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sub Brand</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tables</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No sub brands found</TableCell></TableRow>
            ) : filtered.map((sb) => {
              const brand = brands.find(b => b.id === sb.brandId);
              return (
                <TableRow key={sb.id} className="group">
                  <TableCell className="font-medium"><div className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary shrink-0" />{sb.name}</div></TableCell>
                  <TableCell className="text-muted-foreground">{brand?.name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{sb.location}</TableCell>
                  <TableCell className="text-muted-foreground">{sb.contact}</TableCell>
                  <TableCell>
                    <Link to={`/tables?subBrandId=${sb.id}`} className="text-primary hover:underline text-sm flex items-center gap-1">
                      {tables.filter(t => t.subBrandId === sb.id).length} tables <ChevronRight className="h-3 w-3" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(sb)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(sb.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Sub Brand" : "Add Sub Brand"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Brand *</Label>
              <Select value={form.brandId} onValueChange={(v) => setForm({...form, brandId: v})}>
                <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                <SelectContent>{brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Sub Brand Name *</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Location *</Label><Input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Address *</Label><Input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Contact Number *</Label><Input value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gradient-brand text-primary-foreground">{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Sub Brand" description="This will also delete all associated table configurations." />
    </div>
  );
}

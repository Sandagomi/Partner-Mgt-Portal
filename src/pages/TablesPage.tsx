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
import { Plus, Pencil, Trash2, TableProperties } from "lucide-react";
import { toast } from "sonner";
import { TableConfig } from "@/lib/types";

const emptyForm = { subBrandId: "", tableNumber: "", chairCount: 2 };

export default function TablesPage() {
  const { partners, brands, subBrands, tables, addTable, updateTable, deleteTable } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterSubBrandId = searchParams.get("subBrandId") || "";
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<TableConfig | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = tables
    .filter((t) => !filterSubBrandId || t.subBrandId === filterSubBrandId)
    .filter((t) => t.tableNumber.toLowerCase().includes(search.toLowerCase()));

  const filterSubBrand = subBrands.find(sb => sb.id === filterSubBrandId);
  const filterBrand = filterSubBrand ? brands.find(b => b.id === filterSubBrand.brandId) : null;
  const filterPartner = filterBrand ? partners.find(p => p.id === filterBrand.partnerId) : null;

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, subBrandId: filterSubBrandId }); setDialogOpen(true); };
  const openEdit = (t: TableConfig) => { setEditing(t); setForm({ subBrandId: t.subBrandId, tableNumber: t.tableNumber, chairCount: t.chairCount }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.subBrandId || !form.tableNumber.trim() || form.chairCount < 1) {
      toast.error("Please fill in all required fields"); return;
    }
    if (editing) { updateTable(editing.id, form); toast.success("Table updated"); }
    else { addTable(form); toast.success("Table added"); }
    setDialogOpen(false);
  };

  const handleDelete = () => { if (deleteId) { deleteTable(deleteId); toast.success("Table deleted"); setDeleteId(null); } };

  const breadcrumbs = filterSubBrand && filterBrand && filterPartner
    ? [{ label: "Partners", href: "/partners" }, { label: filterPartner.name }, { label: "Brands", href: `/brands?partnerId=${filterPartner.id}` }, { label: filterBrand.name }, { label: "Sub Brands", href: `/sub-brands?brandId=${filterBrand.id}` }, { label: filterSubBrand.name }, { label: "Tables" }]
    : [{ label: "Table Setup" }];

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{filterSubBrand ? `${filterSubBrand.name} — Tables` : "All Tables"}</h1>
        <Button onClick={openCreate} className="gradient-brand text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Add Table</Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="max-w-sm flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search tables..." /></div>
        {!filterSubBrandId && (
          <Select value={filterSubBrandId} onValueChange={(v) => setSearchParams(v ? { subBrandId: v } : {})}>
            <SelectTrigger className="w-48 bg-card"><SelectValue placeholder="All Sub Brands" /></SelectTrigger>
            <SelectContent>{subBrands.map(sb => <SelectItem key={sb.id} value={sb.id}>{sb.name}</SelectItem>)}</SelectContent>
          </Select>
        )}
      </div>

      <div className="bg-card rounded-lg border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table #</TableHead>
              <TableHead>Sub Brand</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Chairs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No tables found</TableCell></TableRow>
            ) : filtered.map((t) => {
              const sb = subBrands.find(s => s.id === t.subBrandId);
              const brand = sb ? brands.find(b => b.id === sb.brandId) : null;
              return (
                <TableRow key={t.id} className="group">
                  <TableCell className="font-medium font-mono"><div className="flex items-center gap-2"><TableProperties className="h-4 w-4 text-primary shrink-0" />{t.tableNumber}</div></TableCell>
                  <TableCell className="text-muted-foreground">{sb?.name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{brand?.name || "—"}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-sm font-medium">{t.chairCount}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Table" : "Add Table"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Sub Brand *</Label>
              <Select value={form.subBrandId} onValueChange={(v) => setForm({...form, subBrandId: v})}>
                <SelectTrigger><SelectValue placeholder="Select sub brand" /></SelectTrigger>
                <SelectContent>{subBrands.map(sb => <SelectItem key={sb.id} value={sb.id}>{sb.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Table Number / Identifier *</Label><Input value={form.tableNumber} onChange={(e) => setForm({...form, tableNumber: e.target.value})} placeholder="e.g. R-01" /></div>
            <div className="grid gap-2"><Label>Number of Chairs *</Label><Input type="number" min={1} value={form.chairCount} onChange={(e) => setForm({...form, chairCount: parseInt(e.target.value) || 1})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gradient-brand text-primary-foreground">{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Table" description="This table configuration will be permanently removed." />
    </div>
  );
}

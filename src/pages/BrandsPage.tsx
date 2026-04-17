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
import { Plus, Pencil, Trash2, Tags, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Brand } from "@/lib/types";

const emptyForm = { partnerId: "", name: "", location: "", address: "", contact: "", agent: "" };
const agents = ["Agent Alpha", "Agent Beta", "Agent Gamma", "Agent Delta"];

export default function BrandsPage() {
  const { partners, brands, subBrands, addBrand, updateBrand, deleteBrand } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterPartnerId = searchParams.get("partnerId") || "";
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = brands
    .filter((b) => !filterPartnerId || b.partnerId === filterPartnerId)
    .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.location.toLowerCase().includes(search.toLowerCase()));

  const filterPartner = partners.find(p => p.id === filterPartnerId);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, partnerId: filterPartnerId });
    setDialogOpen(true);
  };
  const openEdit = (b: Brand) => {
    setEditing(b);
    setForm({ partnerId: b.partnerId, name: b.name, location: b.location, address: b.address, contact: b.contact, agent: b.agent || "" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.partnerId || !form.name.trim() || !form.location.trim() || !form.address.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (editing) {
      updateBrand(editing.id, form);
      toast.success("Brand updated");
    } else {
      addBrand(form);
      toast.success("Brand created");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteBrand(deleteId);
      toast.success("Brand deleted");
      setDeleteId(null);
    }
  };

  const breadcrumbs = filterPartner
    ? [{ label: "Partners", href: "/partners" }, { label: filterPartner.name, href: `/partners` }, { label: "Brands" }]
    : [{ label: "Brands" }];

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{filterPartner ? `${filterPartner.name} — Brands` : "All Brands"}</h1>
        <Button onClick={openCreate} className="gradient-brand text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Add Brand</Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="max-w-sm flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search brands..." />
        </div>
        {!filterPartnerId && (
          <Select value={filterPartnerId} onValueChange={(v) => setSearchParams(v ? { partnerId: v } : {})}>
            <SelectTrigger className="w-48 bg-card"><SelectValue placeholder="All Partners" /></SelectTrigger>
            <SelectContent>
              {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="bg-card rounded-lg border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Agent Status</TableHead>
              <TableHead>Sub Brands</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No brands found</TableCell></TableRow>
            ) : filtered.map((b) => {
              const partner = partners.find(p => p.id === b.partnerId);
              return (
                <TableRow key={b.id} className="group">
                  <TableCell className="font-medium"><div className="flex items-center gap-2"><Tags className="h-4 w-4 text-primary shrink-0" />{b.name}</div></TableCell>
                  <TableCell className="text-muted-foreground">{partner?.name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{b.location}</TableCell>
                  <TableCell className="text-muted-foreground">{b.contact}</TableCell>
                  <TableCell>
                    {b.agent ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Agent is active</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">No agent</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/sub-brands?brandId=${b.id}`} className="text-primary hover:underline text-sm flex items-center gap-1">
                      {subBrands.filter(sb => sb.brandId === b.id).length} sub brands <ChevronRight className="h-3 w-3" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Brand" : "Add Brand"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Partner *</Label>
              <Select value={form.partnerId} onValueChange={(v) => setForm({...form, partnerId: v})}>
                <SelectTrigger><SelectValue placeholder="Select partner" /></SelectTrigger>
                <SelectContent>{partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Brand Name *</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Location *</Label><Input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Address *</Label><Input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Contact Number *</Label><Input value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} /></div>
            <div className="grid gap-2">
              <Label>Connect Agent</Label>
              <Select value={form.agent} onValueChange={(v) => setForm({...form, agent: v})}>
                <SelectTrigger><SelectValue placeholder="Select an AI agent" /></SelectTrigger>
                <SelectContent>
                  {agents.map(agent => <SelectItem key={agent} value={agent}>{agent}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gradient-brand text-primary-foreground">{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Brand" description="This will also delete all associated sub brands and table configurations." />
    </div>
  );
}

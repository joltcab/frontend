import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import joltcab from "@/lib/joltcab-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag as TagIcon, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function TagManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const queryClient = useQueryClient();

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['tags'],
  queryFn: () => joltcab.entities.Tag.list(),
  });

  const createMutation = useMutation({
  mutationFn: (data) => joltcab.entities.Tag.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setIsDialogOpen(false);
      setEditingTag(null);
    },
  });

  const updateMutation = useMutation({
  mutationFn: ({ id, data }) => joltcab.entities.Tag.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setIsDialogOpen(false);
      setEditingTag(null);
    },
  });

  const deleteMutation = useMutation({
  mutationFn: (id) => joltcab.entities.Tag.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      name: formData.get('name'),
      slug: formData.get('slug') || formData.get('name').toLowerCase().replace(/\s+/g, '-'),
      color: formData.get('color') || '#6B7280',
    };

    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-600">Create tags to better organize and filter content</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#15B46A] hover:bg-[#0F9456]" onClick={() => setEditingTag(null)}>
              <Plus className="w-4 h-4 mr-2" />
              New Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTag ? 'Edit Tag' : 'New Tag'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <Label>Name *</Label>
                <Input
                  name="name"
                  defaultValue={editingTag?.name}
                  placeholder="javascript, react, tutorial..."
                  required
                />
              </div>

              <div>
                <Label>Slug</Label>
                <Input
                  name="slug"
                  defaultValue={editingTag?.slug}
                  placeholder="javascript (auto-generated)"
                />
              </div>

              <div>
                <Label>Color</Label>
                <Input
                  name="color"
                  type="color"
                  defaultValue={editingTag?.color || '#6B7280'}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#15B46A] hover:bg-[#0F9456]">
                  {editingTag ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tags.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <TagIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-4">No tags yet</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-[#15B46A] hover:bg-[#0F9456]">
              <Plus className="w-4 h-4 mr-2" />
              Create First Tag
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Card key={tag.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Badge 
                    className="text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingTag(tag);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => {
                        if (confirm(`Delete "${tag.name}"?`)) {
                          deleteMutation.mutate(tag.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
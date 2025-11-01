import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Eye, ArrowLeft, Upload, X, MapPin } from "lucide-react";
import { createPageUrl } from "@/utils";
import ReactQuill from 'react-quill';

export default function EventEditor() {
  const [user, setUser] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    featured_image: "",
    event_date: "",
    end_date: "",
    location: "",
    location_lat: 0,
    location_lng: 0,
    category_id: "",
    tags: [],
    status: "draft",
    max_attendees: 0,
    ticket_price: 0,
    registration_url: "",
    seo_title: "",
    seo_description: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
  queryFn: () => joltcab.entities.Category.filter({ type: 'event' }),
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ['tags'],
  queryFn: () => joltcab.entities.Tag.list(),
  });

  useEffect(() => {
    loadUser();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setEventId(id);
      loadEvent(id);
    }
  }, []);

  const loadUser = async () => {
    try {
  const userData = await joltcab.auth.me();
      setUser(userData);
      if (!eventId) {
        setFormData(prev => ({ ...prev, organizer_email: userData.email }));
      }
    } catch (error) {
      window.location.href = createPageUrl("Home");
    }
  };

  const loadEvent = async (id) => {
    try {
  const events = await joltcab.entities.Event.list();
      const event = events.find(e => e.id === id);
      if (event) {
        setFormData(event);
      }
    } catch (error) {
      console.error("Error loading event:", error);
    }
  };

  const createMutation = useMutation({
  mutationFn: (data) => joltcab.entities.Event.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      window.location.href = createPageUrl(`Event?slug=${data.slug}`);
    },
  });

  const updateMutation = useMutation({
  mutationFn: ({ id, data }) => joltcab.entities.Event.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      alert("Event updated successfully!");
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
  const { file_url } = await joltcab.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, featured_image: file_url }));
    } catch (error) {
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim();
  };

  const handleSave = async (status = formData.status) => {
    if (!formData.title || !formData.description || !formData.event_date) {
      alert("Title, description, and event date are required");
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        status,
        slug: formData.slug || generateSlug(formData.title),
        organizer_email: user.email,
      };

      if (eventId) {
        await updateMutation.mutateAsync({ id: eventId, data: dataToSave });
      } else {
        await createMutation.mutateAsync(dataToSave);
      }
    } catch (error) {
      alert("Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.location.href = createPageUrl("AdminPanel")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {eventId ? 'Edit Event' : 'Create New Event'}
            </h1>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button className="bg-[#15B46A] hover:bg-[#0F9456]" onClick={() => handleSave('published')} disabled={saving}>
              <Eye className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label>Event Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, slug: prev.slug || generateSlug(e.target.value) }))}
                    placeholder="Event title..."
                    className="text-2xl font-bold h-auto py-4"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date & Time *</Label>
                    <Input
                      type="datetime-local"
                      value={formData.event_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>End Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Event location..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Description *</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(description) => setFormData(prev => ({ ...prev, description }))}
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.featured_image ? (
                  <div className="relative">
                    <img src={formData.featured_image} alt="Featured" className="w-full h-48 object-cover rounded-lg" />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="event-image" />
                    <Button size="sm" variant="outline" onClick={() => document.getElementById('event-image').click()} disabled={uploadingImage}>
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Choose Image'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Max Attendees</Label>
                  <Input
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_attendees: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Ticket Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.ticket_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, ticket_price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Registration URL</Label>
                  <Input
                    type="url"
                    value={formData.registration_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, registration_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category & Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag.id}
                      className="cursor-pointer"
                      style={{
                        backgroundColor: formData.tags?.includes(tag.id) ? tag.color : '#E5E7EB',
                        color: formData.tags?.includes(tag.id) ? '#fff' : '#374151'
                      }}
                      onClick={() => {
                        const tags = formData.tags || [];
                        setFormData(prev => ({ 
                          ...prev, 
                          tags: tags.includes(tag.id) ? tags.filter(t => t !== tag.id) : [...tags, tag.id] 
                        }));
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
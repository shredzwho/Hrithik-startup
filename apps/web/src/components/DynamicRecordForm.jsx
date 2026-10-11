import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import pb from '@/lib/pocketbaseClient';

const DynamicRecordForm = ({ collection, record = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [relatedData, setRelatedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize form data
    const initialData = {};
    collection.fields.forEach(field => {
      if (field.system) return; // Skip system fields
      
      if (record) {
        initialData[field.name] = record[field.name] || getDefaultValue(field);
      } else {
        initialData[field.name] = getDefaultValue(field);
      }
    });
    setFormData(initialData);

    // Fetch related records for relation fields
    const fetchRelatedData = async () => {
      const relatedFields = collection.fields.filter(f => f.type === 'relation');
      for (const field of relatedFields) {
        try {
          const records = await pb.collection(field.collectionId).getFullList({ $autoCancel: false });
          setRelatedData(prev => ({ ...prev, [field.name]: records }));
        } catch (error) {
          console.error(`Error fetching related data for ${field.name}:`, error);
        }
      }
    };

    fetchRelatedData();
  }, [collection, record]);

  const getDefaultValue = (field) => {
    switch (field.type) {
      case 'bool':
        return false;
      case 'number':
        return 0;
      case 'select':
        return '';
      case 'json':
        return {};
      default:
        return '';
    }
  };

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    collection.fields.forEach(field => {
      if (field.system) return;
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    if (field.system) return null;

    const value = formData[field.name];
    const error = errors[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="bg-muted text-foreground"
              placeholder={`Enter ${field.name}`}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type="number"
              value={value}
              onChange={(e) => handleChange(field.name, parseFloat(e.target.value) || 0)}
              className="bg-muted text-foreground"
              min={field.min}
              max={field.max}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'bool':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={value}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
            />
            <Label htmlFor={field.name} className="text-foreground cursor-pointer">
              {field.name}
            </Label>
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleChange(field.name, val)}>
              <SelectTrigger className="bg-muted text-foreground">
                <SelectValue placeholder={`Select ${field.name}`} />
              </SelectTrigger>
              <SelectContent>
                {field.values?.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type="date"
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="bg-muted text-foreground"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'relation':
        const relatedRecords = relatedData[field.name] || [];
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleChange(field.name, val)}>
              <SelectTrigger className="bg-muted text-foreground">
                <SelectValue placeholder={`Select ${field.name}`} />
              </SelectTrigger>
              <SelectContent>
                {relatedRecords.map(rec => (
                  <SelectItem key={rec.id} value={rec.id}>
                    {rec.name || rec.email || rec.title || rec.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type="file"
              onChange={(e) => handleChange(field.name, e.target.files[0])}
              className="bg-muted text-foreground"
              multiple={field.maxSelect > 1}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-foreground">
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={typeof value === 'object' ? JSON.stringify(value) : value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="bg-muted text-foreground"
              rows={3}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collection.fields.map(field => renderField(field))}
      </div>
      
      <div className="flex justify-end gap-4 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? 'Saving...' : record ? 'Update Record' : 'Create Record'}
        </Button>
      </div>
    </form>
  );
};

export default DynamicRecordForm;
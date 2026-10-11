import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import DynamicRecordForm from '@/components/DynamicRecordForm.jsx';

const COLLECTIONS = [
  { id: '_pb_users_auth_', name: 'users' },
  { id: 'pbc_9766656654', name: 'products' },
  { id: 'pbc_9011272426', name: 'reviews' },
  { id: 'pbc_8047264123', name: 'wishlist' },
  { id: 'pbc_7268898147', name: 'orders' },
  { id: 'pbc_6752941096', name: 'referral_program' },
  { id: 'pbc_5740728660', name: 'blog_posts' },
  { id: 'pbc_8540691288', name: 'email_sequences' },
  { id: 'pbc_1795198122', name: 'abandoned_carts' },
  { id: 'pbc_3802798000', name: 'back_in_stock_subscriptions' },
  { id: 'pbc_8603289048', name: 'contact_submissions' },
  { id: 'pbc_5296234131', name: 'athlete_sponsorship_applications' },
  { id: 'pbc_7570982142', name: 'affiliate_applications' },
  { id: 'pbc_4551386742', name: 'loyalty_points' },
  { id: 'pbc_4971176159', name: 'blog_comments' }
];

const CollectionsManager = () => {
  const [selectedCollection, setSelectedCollection] = useState(COLLECTIONS[0]);
  const [collectionSchema, setCollectionSchema] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const perPage = 10;

  useEffect(() => {
    fetchCollectionSchema();
    fetchRecords();
  }, [selectedCollection, page, searchQuery]);

  const fetchCollectionSchema = async () => {
    try {
      const response = await fetch(`${pb.baseUrl}/api/collections/${selectedCollection.id}`);
      const schema = await response.json();
      setCollectionSchema(schema);
    } catch (error) {
      console.error('Error fetching schema:', error);
      toast.error('Failed to load collection schema');
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const filter = searchQuery ? `id ~ "${searchQuery}" || name ~ "${searchQuery}" || email ~ "${searchQuery}"` : '';
      const result = await pb.collection(selectedCollection.name).getList(page, perPage, {
        filter,
        sort: '-created',
        $autoCancel: false
      });
      setRecords(result.items);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (formData) => {
    try {
      await pb.collection(selectedCollection.name).create(formData, { $autoCancel: false });
      toast.success('Record created successfully');
      setShowCreateDialog(false);
      fetchRecords();
    } catch (error) {
      console.error('Error creating record:', error);
      toast.error('Failed to create record');
    }
  };

  const handleUpdateRecord = async (formData) => {
    try {
      await pb.collection(selectedCollection.name).update(selectedRecord.id, formData, { $autoCancel: false });
      toast.success('Record updated successfully');
      setShowEditDialog(false);
      setSelectedRecord(null);
      fetchRecords();
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error('Failed to update record');
    }
  };

  const handleDeleteRecord = async () => {
    try {
      await pb.collection(selectedCollection.name).delete(selectedRecord.id, { $autoCancel: false });
      toast.success('Record deleted successfully');
      setShowDeleteDialog(false);
      setSelectedRecord(null);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  const getDisplayFields = () => {
    if (!collectionSchema) return [];
    return collectionSchema.fields.filter(f => !f.system && !['password', 'tokenKey'].includes(f.name)).slice(0, 5);
  };

  return (
    <>
      <Helmet>
        <title>Collections Manager</title>
        <meta name="description" content="Manage database collections" />
      </Helmet>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Sidebar */}
        <Card className="lg:w-64 flex-shrink-0 luxury-card">
          <CardHeader>
            <CardTitle className="text-foreground">Collections</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {COLLECTIONS.map(collection => (
                <button
                  key={collection.id}
                  onClick={() => {
                    setSelectedCollection(collection);
                    setPage(1);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-4 py-3 transition-all duration-200 ${
                    selectedCollection.id === collection.id
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {collection.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Panel */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground heading-balance">{selectedCollection.name}</h1>
              <p className="text-muted-foreground">Manage records in this collection</p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Record
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10 bg-muted text-foreground"
            />
          </div>

          {/* Table */}
          <Card className="luxury-card">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading records...</div>
              ) : records.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No records found</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">ID</TableHead>
                        {getDisplayFields().map(field => (
                          <TableHead key={field.name} className="text-muted-foreground">{field.name}</TableHead>
                        ))}
                        <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map(record => (
                        <TableRow key={record.id} className="border-border">
                          <TableCell className="font-mono text-sm text-foreground">{record.id}</TableCell>
                          {getDisplayFields().map(field => (
                            <TableCell key={field.name} className="text-foreground">
                              {typeof record[field.name] === 'object'
                                ? JSON.stringify(record[field.name]).substring(0, 50)
                                : String(record[field.name] || '-').substring(0, 50)}
                            </TableCell>
                          ))}
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShowViewDialog(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create New Record</DialogTitle>
          </DialogHeader>
          {collectionSchema && (
            <DynamicRecordForm
              collection={collectionSchema}
              onSubmit={handleCreateRecord}
              onCancel={() => setShowCreateDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Record</DialogTitle>
          </DialogHeader>
          {collectionSchema && selectedRecord && (
            <DynamicRecordForm
              collection={collectionSchema}
              record={selectedRecord}
              onSubmit={handleUpdateRecord}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedRecord(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              {Object.entries(selectedRecord).map(([key, value]) => (
                <div key={key} className="border-b border-border pb-3">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{key}</p>
                  <p className="text-foreground break-all">
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRecord(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRecord}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CollectionsManager;
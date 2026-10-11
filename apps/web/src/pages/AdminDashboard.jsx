import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, ShoppingCart, Star, Database, Settings, Activity } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity] = useState([
    { action: 'User registered', user: 'maya.chen@example.com', time: '2 hours ago' },
    { action: 'New order placed', user: 'Order #1847', time: '4 hours ago' },
    { action: 'Product review added', user: 'Raj Patel', time: '6 hours ago' },
    { action: 'Admin login', user: 'strongman.sg45@gmail.com', time: '8 hours ago' }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, products, orders, reviews] = await Promise.all([
          pb.collection('users').getList(1, 1, { $autoCancel: false }),
          pb.collection('products').getList(1, 1, { $autoCancel: false }),
          pb.collection('orders').getList(1, 1, { $autoCancel: false }),
          pb.collection('reviews').getList(1, 1, { $autoCancel: false })
        ]);

        setStats({
          totalUsers: users.totalItems,
          totalProducts: products.totalItems,
          totalOrders: orders.totalItems,
          totalReviews: reviews.totalItems
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-green-500' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-purple-500' },
    { title: 'Total Reviews', value: stats.totalReviews, icon: Star, color: 'text-yellow-500' }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin dashboard overview" />
      </Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 heading-balance">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back to the admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="luxury-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {loading ? '...' : stat.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/collections">
                <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground">
                  <Database className="w-6 h-6" />
                  <span className="font-medium">Collections Manager</span>
                </Button>
              </Link>
              
              <Link to="/admin/users">
                <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground">
                  <Users className="w-6 h-6" />
                  <span className="font-medium">User Management</span>
                </Button>
              </Link>
              
              <Link to="/admin/settings">
                <Button className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground">
                  <Settings className="w-6 h-6" />
                  <span className="font-medium">Account Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
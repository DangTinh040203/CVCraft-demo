import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, Globe, Linkedin, 
  Camera, ArrowLeft, Save, Loader2, LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const profileSchema = z.object({
  full_name: z.string().max(100, 'Name must be less than 100 characters').optional(),
  job_title: z.string().max(100, 'Job title must be less than 100 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  linkedin_url: z.string().url('Please enter a valid LinkedIn URL').or(z.literal('')).optional(),
});

interface ProfileData {
  full_name: string;
  avatar_url: string;
  job_title: string;
  bio: string;
  phone: string;
  location: string;
  website: string;
  linkedin_url: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    avatar_url: '',
    job_title: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    linkedin_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfileData({
            full_name: data.full_name || '',
            avatar_url: data.avatar_url || '',
            job_title: data.job_title || '',
            bio: data.bio || '',
            phone: data.phone || '',
            location: data.location || '',
            website: data.website || '',
            linkedin_url: data.linkedin_url || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    try {
      // Validate form data
      const result = profileSchema.safeParse(profileData);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }

      setIsSaving(true);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...profileData,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="font-display font-bold text-lg">Profile Settings</h1>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileData.avatar_url} alt={profileData.full_name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(profileData.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    placeholder="https://example.com/avatar.jpg"
                    value={profileData.avatar_url}
                    onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a URL to your profile image
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="full_name"
                      placeholder="John Doe"
                      className="pl-10"
                      value={profileData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-sm text-destructive">{errors.full_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="job_title"
                      placeholder="Software Engineer"
                      className="pl-10"
                      value={profileData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                    />
                  </div>
                  {errors.job_title && (
                    <p className="text-sm text-destructive">{errors.job_title}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user?.email || ''}
                    className="pl-10 bg-muted"
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself..."
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {profileData.bio.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How others can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      className="pl-10"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="San Francisco, CA"
                      className="pl-10"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    className="pl-10"
                    value={profileData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
                {errors.website && (
                  <p className="text-sm text-destructive">{errors.website}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="linkedin_url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="pl-10"
                    value={profileData.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  />
                </div>
                {errors.linkedin_url && (
                  <p className="text-sm text-destructive">{errors.linkedin_url}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <Button variant="destructive" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;

const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.jsx', 'utf8');

const targetStart = 'const Profile = () => {';
const targetEnd = "  const tabs = isOwnProfile \n    ? ['overview', 'repositories', 'saved', 'insights', 'settings']\n    : ['overview', 'repositories', 'saved'];";

const idxStart = content.indexOf(targetStart);
const idxEnd = content.indexOf(targetEnd);

if (idxStart === -1 || idxEnd === -1) {
  console.log('Target not found', idxStart, idxEnd);
  process.exit(1);
}

const newBlock = `const Profile = () => {
  const { username, tab } = useParams();
  const navigate = useNavigate();
  const { 
    firebaseUser, supabaseUser, signOut, 
    displayName, username: authUsername, avatarUrl, bannerUrl, userTitle, 
    locationCity, locationCountry, bio, organization, education, 
    websiteUrl, linkedinUrl, isVerified, memberSince, 
    specializations, tools, interests, followerCount, followingCount, repoCount,
    incrementFollowing, decrementFollowing, refreshProfile
  } = useAuth();
  const { toast } = useToast();
  
  // Logic to determine if it's the own profile
  const isOwnProfile = !username || username === 'me' || username === authUsername;
  
  // Local states
  const [activeTab, setActiveTab] = useState(tab || 'overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (isOwnProfile) {
        setProfileData({
          name: displayName,
          handle: authUsername,
          avatarUrl,
          bannerUrl,
          title: userTitle,
          locationCity,
          locationCountry,
          bio,
          firm: organization,
          education,
          memberSince,
          website: websiteUrl,
          linkedin: linkedinUrl,
          specializations,
          tools,
          stats: { projects: repoCount, followers: followerCount, following: followingCount, upvotes: 0 },
          isVerified,
          showEmail: supabaseUser?.show_email,
        });
        setLoadingProfile(false);
      } else {
        setLoadingProfile(true);
        const { data } = await supabase.from('users').select(\`*, user_specializations(tag), user_tools(tool)\`).eq('username', username).single();
        if (data) {
           const { data: stats } = await supabase.from('user_stats').select('follower_count, following_count').eq('id', data.id).single();
           setProfileData({
              id: data.id,
              name: data.display_name,
              handle: data.username,
              avatarUrl: data.avatar_url,
              bannerUrl: data.banner_url,
              title: data.title,
              locationCity: data.location_city,
              locationCountry: data.location_country,
              bio: data.bio,
              firm: data.organization,
              education: data.education,
              memberSince: data.member_since,
              website: data.website_url,
              linkedin: data.linkedin_url,
              specializations: data.user_specializations?.map(s => s.tag) || [],
              tools: data.user_tools?.map(t => t.tool) || [],
              stats: { projects: 0, followers: stats?.follower_count || 0, following: stats?.following_count || 0, upvotes: 0 },
              isVerified: data.is_verified,
              showEmail: data.show_email
           });
        } else {
           navigate('/not-found');
        }
        setLoadingProfile(false);
      }
    }
    fetchUser();
  }, [isOwnProfile, username, displayName, authUsername, avatarUrl, bannerUrl, userTitle, locationCity, locationCountry, bio, organization, education, memberSince, websiteUrl, linkedinUrl, specializations, tools, followerCount, followingCount, repoCount, supabaseUser, navigate]);

  useEffect(() => {
    if (!firebaseUser && (username === 'me' || !username)) {
      navigate('/login');
    }
  }, [firebaseUser, username, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    await deleteAccount(firebaseUser);
    navigate('/signup');
  };

  const handleFollowToggle = async () => {
    if (isFollowing) {
      decrementFollowing();
      setIsFollowing(false);
    } else {
      incrementFollowing();
      setIsFollowing(true);
      toast.info(\`You are now following @\${profileData?.handle}.\`);
    }
  };

  if (loadingProfile || !profileData) {
    return <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center font-sans text-[#6B6860]">Loading profile...</div>;
  }

  const tabs = isOwnProfile 
    ? ['overview', 'repositories', 'saved', 'insights', 'settings']
    : ['overview', 'repositories', 'saved'];`;

content = content.slice(0, idxStart) + newBlock + content.slice(idxEnd + targetEnd.length);

fs.writeFileSync('src/pages/Profile.jsx', content);
console.log('done');

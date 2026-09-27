(() => {
  const config = window.BLOCKHAUS_BACKEND || {};
  const sdkVersion = '2.117.2';
  let clientPromise;

  function isConfigured() {
    return Boolean(
      config.supabaseUrl
      && config.supabasePublishableKey
      && !config.supabaseUrl.includes('VOTRE-PROJET')
      && !config.supabasePublishableKey.includes('VOTRE_CLE')
    );
  }

  async function client() {
    if (!isConfigured()) throw new Error('Le backend Supabase n’est pas encore configuré.');
    if (!clientPromise) {
      clientPromise = import(`https://cdn.jsdelivr.net/npm/@supabase/supabase-js@${sdkVersion}/+esm`)
        .then(({ createClient }) => createClient(config.supabaseUrl, config.supabasePublishableKey));
    }
    return clientPromise;
  }

  async function sendMagicLink(email) {
    const supabase = await client();
    const redirect = config.appUrl || `${location.origin}${location.pathname}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirect }
    });
    if (error) throw error;
  }

  async function session() {
    const supabase = await client();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function profile() {
    const supabase = await client();
    const currentSession = await session();
    if (!currentSession) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, forum_username, role, approved, disabled_at')
      .eq('id', currentSession.user.id)
      .single();
    if (error) throw error;
    return data;
  }

  async function listRooms() {
    const supabase = await client();
    const { data, error } = await supabase
      .from('rooms')
      .select('id, kind, name, created_at, room_members(user_id, profiles(display_name))')
      .is('archived_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async function listMessages(roomId) {
    const supabase = await client();
    const { data, error } = await supabase
      .from('messages')
      .select('id, room_id, author_id, body, created_at, profiles(display_name)')
      .eq('room_id', roomId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .limit(300);
    if (error) throw error;
    return data;
  }

  async function createPrivateRoom(name) {
    const supabase = await client();
    const { data, error } = await supabase.rpc('create_private_room', { room_name: name, invite_hours: 48 });
    if (error) throw error;
    return data?.[0];
  }

  async function joinWithInvite(token) {
    const supabase = await client();
    const { data, error } = await supabase.rpc('join_room_by_invite', { invite_token: token });
    if (error) throw error;
    return data;
  }

  async function sendMessage(roomId, text) {
    const supabase = await client();
    const currentSession = await session();
    if (!currentSession) throw new Error('Connexion requise.');
    const { error } = await supabase.from('messages').insert({ room_id: roomId, author_id: currentSession.user.id, body: text });
    if (error) throw error;
  }

  async function subscribeToRoom(roomId, onChange) {
    const supabase = await client();
    return supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` }, onChange)
      .subscribe();
  }

  async function adminListProfiles() {
    const supabase = await client();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, forum_username, role, approved, disabled_at, created_at')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  async function adminSetMember(userId, approved, role, disabled = false) {
    const supabase = await client();
    const { data, error } = await supabase.rpc('admin_set_member', {
      target_user: userId,
      new_approved: approved,
      new_role: role,
      new_disabled: disabled
    });
    if (error) throw error;
    return data;
  }

  async function adminCreateChannel(name) {
    const supabase = await client();
    const { data, error } = await supabase.rpc('admin_create_channel', { channel_name: name });
    if (error) throw error;
    return data;
  }

  async function adminUpdateChannel(roomId, name, archived = false) {
    const supabase = await client();
    const { data, error } = await supabase.rpc('admin_update_channel', {
      target_room: roomId,
      new_name: name,
      archive_channel: archived
    });
    if (error) throw error;
    return data;
  }

  window.BlockhausSupabase = {
    isConfigured,
    client,
    sendMagicLink,
    session,
    profile,
    listRooms,
    listMessages,
    createPrivateRoom,
    joinWithInvite,
    sendMessage,
    subscribeToRoom,
    adminListProfiles,
    adminSetMember,
    adminCreateChannel,
    adminUpdateChannel
  };
})();

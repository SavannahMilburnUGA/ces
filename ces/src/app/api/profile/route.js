export async function PUT(req) {
    await connectMongoDB();
    const cookieStore = cookies();
    const session = cookieStore.get("userSession");
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  
    const updates = await req.json();
  
    // Prevent email modification
    delete updates.email;
  
    const user = await User.findById(session.value);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  
    // Apply allowed updates
    user.name = updates.name || user.name;
    user.promoOptIn = updates.promoOptIn ?? user.promoOptIn;
    user.lastProfileUpdate = new Date();
  
    await user.save();
  
    return NextResponse.json({ message: "Profile updated successfully." });
  }
  
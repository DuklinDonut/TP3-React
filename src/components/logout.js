const logout = async () => {
  try {
    await fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include",
    });
    console.log("Logged out successfully");
    // Mettez à jour l’état du frontend pour indiquer que l’utilisateur est déconnecté
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

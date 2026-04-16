import React from "react";
import { Container } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserSearch from "../search/UserSearch";
import LogoutBtn from "../LogoutBtn";

function Header() {
  const { status, userData } = useSelector((state) => state.auth);
  console.log("HEADER userData:", userData);


  const displayName =
    userData?.data.username || userData?.fullName || "User";

  const navigate = useNavigate();

  // Header is only meant for authenticated users
  if (!status) return null;

  const navItems = [
    { name: "Home", slug: "/" },
    { name: "Inbox", slug: "/inbox" },
    { name: "Add Post", slug: "/add-post" },
    { name: "Profile", slug: "/profile" },
  ];

  return (
    <header className="py-3 shadow bg-violet-500">
      <Container>
        <nav className="flex items-center">
          {/* Logo */}
          <div className="mr-4">
            <Link to="/">
              <span className="font-bold text-lg text-white">
                Messenger
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <ul className="flex ml-auto items-center">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className="inline-block px-6 py-2 text-white duration-200 hover:bg-blue-600 rounded-full"
                >
                  {item.name}
                </button>
              </li>
            ))}

            {/* Username */}
            <li className="text-white mr-4 font-medium">
              @{displayName}
            </li>

            {/* Logout */}
            <li>
              <LogoutBtn />
            </li>
          </ul>
          <UserSearch/>
        </nav>
      </Container>
    </header>
  );
}

export default Header;

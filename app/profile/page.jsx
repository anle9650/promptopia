"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `/api/users/${id ? id : session?.user.id}/posts`
      );
      const data = await response.json();
      setPosts(data);
    };

    if (id || session?.user.id) {
      fetchPosts();
    }
  }, []);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        setPosts((prevPosts) =>
          prevPosts.filter((prevPost) => prevPost._id !== post._id)
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name={name ? name : "My"}
      desc={
        name
          ? `Welcome to ${name}'s personalized profile page. Explore ${name}'s exceptional prompts and be inspired by the power of their imagination.`
          : "Welcome to your personalized profile page"
      }
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default UserProfile;

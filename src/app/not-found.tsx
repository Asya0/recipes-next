"use client";

import { Button } from "@/components";
import Header from "@/components/Header";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1>404 - Not found</h1>
        <p>Sorry, this page not exist.</p>
        <div style={{display: "flex", gap: "10px"}}>
          <Link href="/">
          <Button>Back to main</Button>
        </Link>
        <Link href="/recipes">
          <Button>Go to recipes</Button>
        </Link>
        </div>
      </div>
    </>
  );
}

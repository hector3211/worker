import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// async function auth() {
//   const res = await fetch("/api/user/current");
//   if (!res.ok) {
//     return;
//   }
//   const user: User | null = await res.json();
//   if (user) {
//     return user;
//   }
// } // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    // .middleware(async ({ req }) => {
    // This code runs on your server before upload
    // If you throw, the user will not be able to upload
    // if (!user) {
    //   throw new Error("Unauthorized");
    // }
    //
    // // Whatever is returned here is accessible in onUploadComplete as `metadata`
    // return { userId: user.id };
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:");

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "images_postId_key" ON "images"("postId");

export class Book {
  id: number = 0;
  title: Title = new Title();
  coverImage: CoverImage = new CoverImage();
  volumes: number = 0;  // Removed the optional marker if backend requires a value
  status: string = "";
  format: string = "";
  showdetails: boolean = false;
  description: string = "";
  author: string = "";
  pages: number = 0;
  isLoaned?: boolean; // Add this line
  dueDate?: Date; // Optionally add this if you manage due dates
}

class CoverImage {
  large: string = "";  // Ensure default values are not null
}

class Title {
  english: string = "";
  romaji: string = "";
  native: string = "";
}

export class Book {
  id: number = 0;
  title: Title = new Title();
  coverImage: CoverImage = new CoverImage();
  volumes?: number = 0;
  status: string = "";
  format: string = "";
  showdetails: boolean = false;

  // missing properties
  description?: string = "";
  author?: string = "";
  pages?: number = 0;
}

class CoverImage {
  large?: string = "";
}

class Title {
  english?: string = "";
  romaji?: string = "";
  native?: string = "";
}

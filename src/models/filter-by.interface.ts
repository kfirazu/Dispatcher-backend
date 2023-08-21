export interface FilterBy {
    // [key: string]: string | DateOptions
    type: string;
    source: string;
    category: string;
    country: string;
    language: string;
    sortBy: string;
    from?: Date
    to?: Date
    // dates?: DateOptions; 
}

export interface DateOptions {
    from?: Date 
    to?: Date
  }
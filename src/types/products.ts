export interface IProduct {
      id: string;
      title: string;
      price: number;
      description: string;
  };
  
export interface IStock {
      product_id: string;
      count: number;
  };
  
import { v4 as uuidv4 } from 'uuid';

export const productsDB = [
    {
      id: uuidv4(),
      title: "JavaScript: The Good Parts: The Good Parts",
      price: 30,
      description: "With JavaScript: The Good Parts, you'll discover a beautiful, elegant, lightweight and highly expressive language that lets you create effective code, whether you're managing object libraries or just trying to get Ajax to run fast. If you develop sites or applications for the Web, this book is an absolute must"
    },
    {
      id: uuidv4(),
      title: "Effective JavaScript: 68 Specific Ways to Harness the Power of JavaScript",
      price: 22,
      description: "Effective JavaScript is organized around 68 proven approaches for writing better JavaScript, backed by concrete examples. You’ll learn how to choose the right programming style for each project, manage unanticipated problems, and work more successfully with every facet of JavaScript programming from data structures to concurrency"
    },
    {
      id: uuidv4(),
      title: "JavaScript: The Definitive Guide",
      price: 40,
      description: "This Fifth Edition is completely revised and expanded to cover JavaScript as it is used in today's Web 2.0 applications. This book is both an example-driven programmer's guide and a keep-on-your-desk reference, with new chapters that explain everything you need to know to get the most out of JavaScript"
    },
  ];

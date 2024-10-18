export class NomenclatureConverter {
  // Método para convertir de camelCase a snake_case
  camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  // Método para convertir de snake_case a camelCase
  snakeToCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  // Método para convertir de camelCase a PascalCase
  camelToPascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Método para convertir de PascalCase a camelCase
  pascalToCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  // Método para convertir de camelCase a kebab-case
  camelToKebabCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }

  // Método para convertir de kebab-case a camelCase
  kebabToCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  // Método para convertir de snake_case a Title Case
  snakeToTitleCase(str: string): string {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Método para convertir de Title Case a snake_case
  titleToSnakeCase(str: string): string {
    return str
      .split(' ')
      .map((word) => word.toLowerCase())
      .join('_');
  }

  // Método para convertir de kebab-case a Title Case
  kebabToTitleCase(str: string): string {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Método para convertir de Title Case a kebab-case
  titleToKebabCase(str: string): string {
    return str
      .split(' ')
      .map((word) => word.toLowerCase())
      .join('-');
  }

  // Método para convertir de Title Case a camelCase
  titleToCamelCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      );
  }

  // Método para convertir de Title Case a PascalCase
  titleToPascalCase(str: string): string {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}

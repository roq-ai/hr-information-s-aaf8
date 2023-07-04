const mapping: Record<string, string> = {
  attendances: 'attendance',
  companies: 'company',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

export interface IJestorObjectListRequest {
  object_type: string;
  page: number;
  size: number;
}

export interface IJestorObjectListResponse {
  status: boolean;
  data: {
    warnings: [];
    items: [];
    total: number;
    has_more: boolean;
  };
  metadata: {
    response: string;
    message: string;
    notifications: [];
  };
}

export interface CreateUserParams {
  email: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateUserParams extends Pick<CreateUserParams, 'password'> {}

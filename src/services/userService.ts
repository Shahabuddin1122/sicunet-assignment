import fetchService from './fetchService';
import { User, CreateUser, PartialUser, AddUser } from '@/types/user';

interface UserResponse {
    users: User[];
    total: number;
    skip: number;
    limit: number;
}

class UserService {
    private endpoint = "/users";

    // Get all users with pagination
    async getUsers(skip: number = 0, limit: number = 10): Promise<UserResponse> {
        return await fetchService.get<UserResponse>(`${this.endpoint}?skip=${skip}&limit=${limit}`);
    }

    // Get a single user by ID
    async getUserById(id: number): Promise<User> {
        return await fetchService.get<User>(`${this.endpoint}/${id}`);
    }

    // Search users by query
    async searchUsers(query: string): Promise<UserResponse> {
        return await fetchService.get<UserResponse>(`${this.endpoint}/search?q=${encodeURIComponent(query)}`);
    }

    // Create a new user
    async createUser(userData: CreateUser): Promise<User> {
        return await fetchService.post<User>(`${this.endpoint}/add`, userData);
    }

    // Add a new user (simplified version for the form)
    async addUser(userData: AddUser): Promise<User> {
        return await fetchService.post<User>(`${this.endpoint}/add`, userData);
    }

    // Update a user (full update)
    async updateUser(id: number, userData: User): Promise<User> {
        return await fetchService.put<User>(`${this.endpoint}/${id}`, userData);
    }

    // Partially update a user
    async partialUpdateUser(id: number, userData: PartialUser): Promise<User> {
        return await fetchService.put<User>(`${this.endpoint}/${id}`, userData);
    }

    // Delete a user
    async deleteUser(id: number): Promise<User> {
        return await fetchService.delete<User>(`${this.endpoint}/${id}`);
    }

    // Get users by specific filters
    async getUsersByFilter(filters: {
        age?: number;
        gender?: string;
        bloodGroup?: string;
        eyeColor?: string;
    }): Promise<UserResponse> {
        const queryParams = new URLSearchParams();
        
        if (filters.age) queryParams.append('age', filters.age.toString());
        if (filters.gender) queryParams.append('gender', filters.gender);
        if (filters.bloodGroup) queryParams.append('bloodGroup', filters.bloodGroup);
        if (filters.eyeColor) queryParams.append('eyeColor', filters.eyeColor);

        const queryString = queryParams.toString();
        return await fetchService.get<UserResponse>(`${this.endpoint}/filter?${queryString}`);
    }
}

const userService = new UserService();
export default userService;
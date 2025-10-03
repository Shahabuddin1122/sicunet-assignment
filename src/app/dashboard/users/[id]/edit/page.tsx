"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import userService from "@/services/userService";
import { User } from "@/types/user";

interface EditUserForm {
    username: string;
    password: string;
    email: string;
    birthDate: string;
    weight: number;
    image: string;
}

export default function EditUserPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    const [userData, setUserData] = useState<User | null>(null);
    const [formData, setFormData] = useState<EditUserForm>({
        username: "",
        password: "",
        email: "",
        birthDate: "",
        weight: 0,
        image: "",
    });
    const [errors, setErrors] = useState<
        Partial<Record<keyof EditUserForm, string>>
    >({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleLogout = () => {
        logout();
    };

    const fetchUserData = useCallback(async () => {
        try {
            setIsLoading(true);
            const user = await userService.getUserById(parseInt(userId));
            setUserData(user);

            // Populate form with existing user data
            // Convert birth date to proper format for HTML date input (YYYY-MM-DD)
            const formatDateForInput = (dateString: string) => {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            };

            setFormData({
                username: user.username,
                password: user.password,
                email: user.email,
                birthDate: formatDateForInput(user.birthDate),
                weight: user.weight,
                image: user.image,
            });
        } catch (err: unknown) {
            setSubmitError(
                err instanceof Error ? err.message : "Failed to fetch user data"
            );
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId, fetchUserData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "weight" ? parseFloat(value) || 0 : value,
        }));

        // Clear error when user starts typing
        if (errors[name as keyof EditUserForm]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof EditUserForm, string>> = {};

        // Required field validation
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.birthDate) {
            newErrors.birthDate = "Birth date is required";
        } else {
            // Age validation (must be 18 or older)
            const birthDate = new Date(formData.birthDate);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            if (age < 18) {
                newErrors.birthDate = "User must be at least 18 years old";
            }
        }

        if (!formData.image.trim()) {
            newErrors.image = "Image URL is required";
        }

        // Weight validation (decimal, 1-300)
        if (formData.weight <= 0) {
            newErrors.weight = "Weight is required";
        } else if (formData.weight < 1 || formData.weight > 300) {
            newErrors.weight = "Weight must be between 1 and 300 kg";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateRandomImageUrl = () => {
        const imageUrls = [
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        ];
        const randomUrl =
            imageUrls[Math.floor(Math.random() * imageUrls.length)];
        setFormData((prev) => ({ ...prev, image: randomUrl }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !userData) {
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);

            // Create updated user object with all required fields
            const updatedUser: User = {
                ...userData,
                username: formData.username,
                password: formData.password,
                email: formData.email,
                birthDate: formData.birthDate,
                weight: formData.weight,
                image: formData.image,
            };

            await userService.updateUser(parseInt(userId), updatedUser);

            // Redirect to dashboard on success
            router.push("/dashboard");
        } catch (err: unknown) {
            setSubmitError(
                err instanceof Error ? err.message : "Failed to update user"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-foreground-muted">
                        Loading user data...
                    </p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">User not found</p>
                    <Button
                        onClick={() => router.push("/dashboard")}
                        variant="outline"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-warm">
            {/* Header */}
            <header className="bg-background shadow-soft">
                <div className="container mx-auto px-4 py-4 flex justify-end sm:justify-between items-center">
                    <h1 className="text-2xl font-bold text-foreground hidden sm:block">
                        Edit User
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-foreground-muted">
                            Welcome, {user?.username}
                        </span>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="sm"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        onClick={() =>
                            router.push(`/dashboard/users/${userId}`)
                        }
                        variant="outline"
                    >
                        ← Back to User Details
                    </Button>
                </div>

                {/* Edit User Form */}
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-primary">
                            Edit User: {userData.firstName} {userData.lastName}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    Username *
                                </label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={
                                        errors.username ? "border-red-500" : ""
                                    }
                                    placeholder="Enter username"
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    Password *
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={
                                        errors.password ? "border-red-500" : ""
                                    }
                                    placeholder="Enter password"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    Email *
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={
                                        errors.email ? "border-red-500" : ""
                                    }
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Birth Date */}
                            <div>
                                <label
                                    htmlFor="birthDate"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    Birth Date *
                                </label>
                                <Input
                                    id="birthDate"
                                    name="birthDate"
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    className={
                                        errors.birthDate ? "border-red-500" : ""
                                    }
                                />
                                {errors.birthDate && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.birthDate}
                                    </p>
                                )}
                            </div>

                            {/* Weight */}
                            <div>
                                <label
                                    htmlFor="weight"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    Weight (kg) *
                                </label>
                                <Input
                                    id="weight"
                                    name="weight"
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    max="300"
                                    value={formData.weight || ""}
                                    onChange={handleInputChange}
                                    className={
                                        errors.weight ? "border-red-500" : ""
                                    }
                                    placeholder="Enter weight in kg"
                                />
                                {errors.weight && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.weight}
                                    </p>
                                )}
                            </div>

                            {/* Image URL */}
                            <div>
                                <label
                                    htmlFor="image"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    Image URL *
                                </label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="image"
                                        name="image"
                                        type="url"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        className={
                                            errors.image ? "border-red-500" : ""
                                        }
                                        placeholder="Enter image URL"
                                    />
                                    <Button
                                        type="button"
                                        onClick={generateRandomImageUrl}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Random
                                    </Button>
                                </div>
                                {errors.image && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.image}
                                    </p>
                                )}
                                {formData.image && (
                                    <div className="mt-2">
                                        <Image
                                            src={formData.image}
                                            alt="Preview"
                                            width={64}
                                            height={64}
                                            className="w-16 h-16 rounded-full object-cover border"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Submit Error */}
                            {submitError && (
                                <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
                                    {submitError}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/users/${userId}`
                                        )
                                    }
                                    variant="outline"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? "Updating User..."
                                        : "Update User"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

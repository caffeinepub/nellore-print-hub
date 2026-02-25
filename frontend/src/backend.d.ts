import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Review {
    id: string;
    customerName: string;
    projectType: ServiceType;
    reviewText: string;
    imageUrl?: string;
    submissionDate: bigint;
    rating: bigint;
}
export interface QuotationDetails {
    terms: string;
    description: string;
    approvalTimestamp?: bigint;
    approved: boolean;
    price: bigint;
}
export interface OfficeLocation {
    lat: number;
    lon: number;
    address: string;
}
export interface AdminUser {
    principal?: Principal;
    active: boolean;
    registrationTimestamp: bigint;
    registrationMethod: Variant_internetIdentity_biometric;
}
export interface AdminInvitationEntry {
    invitedBy: Principal;
    email: string;
    invitationTimestamp: bigint;
    hashedPassword: string;
    registrationMethod: Variant_internetIdentity_biometric;
}
export interface NegotiationMessage {
    sender: string;
    message: string;
    timestamp: bigint;
}
export interface QuotationRequest {
    id: string;
    status: QuotationStatus;
    serviceType: ServiceType;
    customer: Principal;
    mobileNumber: string;
    deadline: bigint;
    email: string;
    negotiationHistory: Array<NegotiationMessage>;
    timestamp: bigint;
    projectDetails: string;
    quotationFileBlob?: ExternalBlob;
}
export interface ChatMessage {
    id: string;
    senderIsOwner: boolean;
    messageText: string;
    isReply: boolean;
    originalMessageId?: string;
    replyToMessageId?: string;
    timestamp: bigint;
    senderName: string;
    senderEmail: string;
}
export interface Project {
    id: string;
    title: string;
    dateCompleted: bigint;
    description: string;
    imageUrl: string;
    category: ServiceType;
}
export interface ContactInfo {
    email: string;
    phone: string;
    location: string;
}
export interface UserProfile {
    name: string;
    mobileNumber: string;
    email: string;
}
export enum QuotationStatus {
    rejected = "rejected",
    accepted = "accepted",
    negotiating = "negotiating",
    pendingCustomerResponse = "pendingCustomerResponse"
}
export enum ServiceType {
    banner = "banner",
    offset = "offset",
    design = "design",
    digital = "digital"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_internetIdentity_biometric {
    internetIdentity = "internetIdentity",
    biometric = "biometric"
}
export interface backendInterface {
    addInternetIdentityAdmin(principal: Principal): Promise<void>;
    addProject(imageUrl: string, title: string, description: string, category: ServiceType): Promise<string>;
    addQuotationDetails(quotationId: string, price: bigint, description: string, terms: string): Promise<void>;
    addReview(customerName: string, reviewText: string, rating: bigint, imageUrl: string | null, projectType: ServiceType): Promise<string>;
    approveQuotation(quotationId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateDeliveryFee(distance: bigint): Promise<bigint>;
    createQuotationRequest(serviceType: ServiceType, deadline: bigint, projectDetails: string, mobileNumber: string, email: string): Promise<string>;
    deleteProject(projectId: string): Promise<void>;
    editProject(projectId: string, imageUrl: string, title: string, description: string, category: ServiceType): Promise<void>;
    getAdminInvitations(): Promise<Array<AdminInvitationEntry>>;
    getAdminPrincipals(): Promise<Array<AdminUser>>;
    getAdminUserCount(): Promise<bigint>;
    getAllChatMessages(): Promise<Array<ChatMessage>>;
    getAllProjects(): Promise<Array<Project>>;
    getAllQuotations(): Promise<Array<QuotationRequest>>;
    getAllReviews(): Promise<Array<Review>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatsForCustomer(senderEmail: string): Promise<Array<ChatMessage>>;
    getContactInfo(): Promise<ContactInfo | null>;
    getCustomerChatHistory(senderEmail: string): Promise<{
        messages: Array<ChatMessage>;
        replies: Array<ChatMessage>;
    }>;
    getLogo(): Promise<ExternalBlob | null>;
    getMyQuotations(): Promise<Array<QuotationRequest>>;
    getOfficeLocation(): Promise<OfficeLocation | null>;
    getProjectsByCategory(category: ServiceType): Promise<Array<Project>>;
    getQuotationDetails(quotationId: string): Promise<QuotationDetails | null>;
    getQuotationStatistics(): Promise<{
        pending: bigint;
        rejected: bigint;
        accepted: bigint;
        negotiating: bigint;
    }>;
    getReviewsByRating(rating: bigint): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    handleQuotationResponse(quotationId: string, status: QuotationStatus, message: string | null): Promise<void>;
    inviteAdminUser(email: string, hashedPassword: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    ownerReply(replyToMessageId: string, replyText: string): Promise<string>;
    registerBiometric(email: string): Promise<void>;
    registerFirstAdmin(): Promise<void>;
    respondToNegotiation(quotationId: string, message: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(senderName: string, senderEmail: string, messageText: string): Promise<string>;
    setLogo(_logo: ExternalBlob): Promise<void>;
    setOfficeLocation(_location: OfficeLocation): Promise<void>;
    updateContactInfo(email: string, phone: string, location: string): Promise<void>;
    uploadQuotationFile(quotationId: string, file: ExternalBlob): Promise<void>;
    verifyAuthentication(email: string, hashedPassword: string): Promise<boolean>;
}

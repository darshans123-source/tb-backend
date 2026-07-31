import { UserRecord, UserRole } from "../types/index.js";
import { hashPassword } from "../utils/jwt.js";

class UserService {
  private userDatabase: Map<string, UserRecord> = new Map();

  constructor() {
    this.seedUsers();
  }

  private seedUsers() {
    const initialUsers: UserRecord[] = [
      {
        id: "usr_student",
        name: "Dr. Student",
        email: "student@tbquest.edu",
        passwordHash: hashPassword("student123"),
        role: "student",
        level: 1,
        xp: 0,
        accuracy: 0,
        streak: 0,
        completedCases: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_faculty",
        name: "Dr. Anandkumar Harwalkar",
        email: "faculty@tbquest.edu",
        passwordHash: hashPassword("faculty123"),
        role: "faculty",
        level: 10,
        xp: 8500,
        accuracy: 98,
        streak: 30,
        completedCases: 150,
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_admin",
        name: "System Administrator",
        email: "admin@tbquest.edu",
        passwordHash: hashPassword("admin123"),
        role: "admin",
        level: 99,
        xp: 99999,
        accuracy: 100,
        streak: 100,
        completedCases: 500,
        createdAt: new Date().toISOString()
      }
    ];

    initialUsers.forEach(u => this.userDatabase.set(u.email.toLowerCase(), u));
  }

  public findByEmail(email: string): UserRecord | undefined {
    return this.userDatabase.get(email.toLowerCase().trim());
  }

  public createUser(name: string, email: string, password: string, role: UserRole): UserRecord {
    const cleanEmail = email.toLowerCase().trim();
    const newUser: UserRecord = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: hashPassword(password),
      role: (role === 'faculty' || role === 'admin') ? role : 'student',
      level: 1,
      xp: 0,
      accuracy: 100,
      streak: 1,
      completedCases: 0,
      createdAt: new Date().toISOString()
    };

    this.userDatabase.set(cleanEmail, newUser);
    return newUser;
  }

  public updateRole(email: string, role: UserRole) {
    const user = this.findByEmail(email);
    if (user && (role === 'student' || role === 'faculty' || role === 'admin')) {
      user.role = role;
    }
  }

  public getAllUsers(): Omit<UserRecord, 'passwordHash'>[] {
    return Array.from(this.userDatabase.values()).map(({ passwordHash, ...user }) => user);
  }

  public count(): number {
    return this.userDatabase.size;
  }
}

export const userService = new UserService();

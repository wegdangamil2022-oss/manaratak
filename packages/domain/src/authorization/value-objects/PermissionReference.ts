export class PermissionReference {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('PermissionReference cannot be empty');
    }
  }

  equals(other: PermissionReference): boolean {
    return this.value === other.value;
  }
}

namespace backend.Models.Audit
{
    public enum VerificationStatus
    {
        Pending = 0,
        Verified = 1,
        Invalid = 2,
        Tampered = 3,
        NotFound = 4
    }
}

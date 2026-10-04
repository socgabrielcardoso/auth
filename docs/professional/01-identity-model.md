# Identity Model

The lab separates identity, authentication factor, session and authorization.

An identity represents the subject. Authentication proves control of one or more factors. A session carries authenticated state. Authorization decides what that subject may do.

Keeping these concepts separate avoids security logic becoming tangled.
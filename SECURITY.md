# Security Policy

## Supported Versions

Ryder is maintained as a single-release-line Hugo theme. Security fixes are provided for the latest published release and the `main` branch.

| Version | Supported |
| ------- | --------- |
| `main` | :white_check_mark: |
| Latest release | :white_check_mark: |
| Older releases | :x: |

## Reporting a Vulnerability

Please use GitHub's private vulnerability reporting feature for this repository to report suspected security issues.

If private reporting is unavailable, contact the maintainer directly:

- Ben Strawbridge
- https://www.benstrawbridge.com/

Please do not open a public GitHub issue for suspected vulnerabilities.

Include the following where possible:

- affected version, tag, or commit
- steps to reproduce
- expected impact
- any proof of concept or suggested remediation

## Scope

In scope:

- vulnerabilities in Ryder templates, partials, shortcodes, JavaScript, and bundled assets
- dependency-related issues in this repository's build and test toolchain
- insecure defaults in the theme that could reasonably affect downstream users

Usually out of scope unless the issue is caused by Ryder itself:

- vulnerabilities introduced by a site owner's content, hosting, or deployment setup
- third-party services configured by end users
- local-only issues with no realistic security impact beyond a developer's own machine

## Response Process

The maintainer will aim to:

- acknowledge reports within 7 days
- investigate and confirm impact
- coordinate a fix and release when needed
- credit the reporter if they want attribution

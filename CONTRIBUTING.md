# Contributing to Expense Tracker

Thank you for considering contributing! This guide will help you get started.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Include:
   - Clear description and steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, Node version)

### Suggesting Features

1. Check if the feature has been suggested
2. Provide a clear use case and explain why it would be useful
3. Consider implementation complexity

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (see Commit Guidelines below)
6. Push to your branch: `git push origin feature/your-feature`
7. Open a Pull Request with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Firebase credentials to .env

# Run development server
npm run dev
```

## Coding Standards

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` type when possible

### React
- Use functional components with hooks
- Keep components focused and small
- Implement proper error handling

### Styling
- Use TailwindCSS utility classes
- Follow existing design patterns
- Ensure responsive design
- Test dark mode compatibility

### File Organization
```
components/ui/      # Reusable UI primitives
components/         # Feature-specific components
lib/               # Utilities, types, and Firebase config
contexts/          # React contexts
app/               # Next.js pages
```

## Commit Guidelines

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/config changes

Examples:
```
feat: add expense export to CSV
fix: resolve date picker timezone issue
docs: update installation instructions
```

## Testing

- Test all new features manually
- Ensure existing functionality still works
- Test across different browsers
- Verify mobile responsiveness
- Check dark mode compatibility

## Pull Request Checklist

- [ ] Code follows the project's coding standards
- [ ] Changes have been tested locally
- [ ] Documentation has been updated if needed
- [ ] Commit messages follow the conventional format
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile/tablet/desktop

## Code Review Process

Maintainers will review for:
- Code quality and style
- Functionality and correctness
- Performance impact
- Security considerations
- Accessibility compliance

## Questions?

- Open an issue for discussion
- Check existing documentation
- Review closed issues and PRs for similar topics

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

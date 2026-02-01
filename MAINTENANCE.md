## Maintenance & Updates

### Keeping Dependencies Updated

Regularly update dependencies to get security patches and new features:

```bash
# Check for outdated packages
npm outdated

# Update all packages to their latest version
npm update

# Interactive update - choose which packages to update
npm upgrade
```

### Monitoring Deployments

Use Vercel Dashboard to:
- View deployment history
- Check build logs
- Monitor performance
- Set up analytics

### Rollback

To rollback to a previous deployment:
1. Go to Vercel Dashboard
2. Navigate to your project
3. Find the deployment you want
4. Click "Rollback" or redeploy an older version

## Performance Optimization

### Current Optimizations
- Vite for fast bundling
- React 19 for optimal performance
- Tree-shaking enabled
- Code splitting for components

### Further Optimization
- Add image optimization (sharp)
- Implement lazy loading for components
- Use React.memo for expensive components
- Set up Lighthouse CI

## Backup Strategy

Store backups of:
1. GitHub repository (primary backup)
2. Local development environment
3. Important configurations (.env.example)

Keep `.env.local` only locally - never in version control.

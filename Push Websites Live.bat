@echo off
title Push Let's Get Out, Kids! & Hidden Food Gems Live to Vercel
echo ====================================================================
echo   1/2 Pushing Let's Get Out, Kids! (letsgetoutkids.com) to GitHub...
echo   (If a GitHub Sign-In box pops up, click "Sign in with your browser")
echo ====================================================================
cd /d "C:\Users\mikic\iehome-events"
git push origin nationwide:main nationwide

echo.
echo ====================================================================
echo   2/2 Pushing Hidden Food Gems (hiddenfoodgem.com) to GitHub...
echo ====================================================================
cd /d "T:\antigravity\mibees\hidden-food-gems"
git push origin main

echo.
echo ====================================================================
echo   DONE! Both websites have been pushed to GitHub / Vercel!
echo ====================================================================
pause

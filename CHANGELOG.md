# Changelog

All notable changes to Shutdown Scheduler will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- System tray/menubar integration with context menu
- Tray icon click toggles app window visibility
- Dynamic tray menu updates showing scheduled tasks
- macOS menubar title support for countdown display
- IPC handlers for renderer-to-tray communication

### Changed
- Upgraded all dependencies to latest versions
- Improved code quality with Biome/Ultracite linting
- Reorganized imports to use `node:` protocol for Node.js builtins

## [0.0.7] - 2025-01-09

### Fixed
- Improved Windows date format handling with enforced double digits
- Updated README for clarity on packaging and installer generation steps

## [0.0.6] - 2025-01-08

### Fixed
- Combined schtasks command for faster execution on Windows

## [0.0.5] - 2025-01-07

### Fixed
- Reordered notification logic to ensure toast and click event are properly handled
- Enhanced update notification with clickable event for user interaction
- Updated layout for weekly task days display to support wrapping
- Conditionally enable update notifications for the Electron app

## [0.0.4] - 2025-01-06

### Added
- Implemented update notification system for app updates

## [0.0.3] - 2025-01-05

### Fixed
- Updated layout for schedule card and add advanced settings support for scheduled tasks

## [0.0.2] - 2025-01-04

### Fixed
- Updated Windows command to use 'explorer.exe' for opening user data location
- Commented out main window maximize to prevent automatic resizing
- Restricted terminal command buttons to macOS only
- Corrected spelling of 'Database' and improved error handling
- Adjusted OS query condition to exclude Windows for terminal command instructions
- Improved error handling by standardizing error messages

### Added
- Enhanced scheduling functionality with day of week support
- App version retrieval functionality
- Error handling for mutations in QueryClient configuration

## [0.0.1] - 2025-01-03

### Added
- Initial release
- Cross-platform shutdown/reboot scheduling (Windows, macOS, Linux)
- One-time, daily, and weekly scheduling options
- Task management with enable/disable toggle
- Modern React UI with TanStack Query
- Dark/light theme support

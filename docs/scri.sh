#!/usr/bin/env bash

set -e

DOCS_DIR="docs"

echo "Creating Worcable documentation structure..."

# Base directories
mkdir -p $DOCS_DIR

mkdir -p $DOCS_DIR/introduction
mkdir -p $DOCS_DIR/getting-started
mkdir -p $DOCS_DIR/concepts
mkdir -p $DOCS_DIR/features
mkdir -p $DOCS_DIR/api
mkdir -p $DOCS_DIR/deployment
mkdir -p $DOCS_DIR/contribute

# Root page
touch $DOCS_DIR/index.md

# Introduction
touch $DOCS_DIR/introduction/what-is-worcable.md
touch $DOCS_DIR/introduction/why-worcable.md

# Getting started
touch $DOCS_DIR/getting-started/installation.md
touch $DOCS_DIR/getting-started/quick-start.md
touch $DOCS_DIR/getting-started/first-recruitment.md

# Concepts
touch $DOCS_DIR/concepts/candidates.md
touch $DOCS_DIR/concepts/jobs.md
touch $DOCS_DIR/concepts/pipeline.md
touch $DOCS_DIR/concepts/evaluations.md

# Features
touch $DOCS_DIR/features/candidate-management.md
touch $DOCS_DIR/features/job-management.md
touch $DOCS_DIR/features/recruitment-pipeline.md
touch $DOCS_DIR/features/analytics.md
touch $DOCS_DIR/features/roles-permissions.md

# API
touch $DOCS_DIR/api/overview.md
touch $DOCS_DIR/api/authentication.md
touch $DOCS_DIR/api/candidates.md
touch $DOCS_DIR/api/jobs.md

# Deployment
touch $DOCS_DIR/deployment/self-hosting.md
touch $DOCS_DIR/deployment/docker.md

# Contribution
touch $DOCS_DIR/contribute/contribution-guide.md
touch $DOCS_DIR/contribute/roadmap.md

echo "Documentation structure created successfully."
echo ""
echo "You can now start writing your Worcable documentation."
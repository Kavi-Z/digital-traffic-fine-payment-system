#!/usr/bin/env python3
import os
from pathlib import Path

base_path = r'f:\semester 06\EC6208-Software Architcture(TE)\project\digital-traffic-fine-payment-system\mobile_app'

directories = [
    'lib\\theme',
    'lib\\models',
    'lib\\services',
    'lib\\providers',
    'lib\\router',
    'lib\\screens\\auth',
    'lib\\screens\\home',
    'lib\\screens\\payment',
    'lib\\widgets',
    'assets\\images',
    'assets\\fonts',
    'android',
    'ios',
    'web'
]

created_dirs = []
for dir_path in directories:
    full_path = os.path.join(base_path, dir_path)
    Path(full_path).mkdir(parents=True, exist_ok=True)
    created_dirs.append(dir_path)

print('✓ All directories created successfully!')
print(f'\nDirectory structure created at: {base_path}')
print('\nDirectories created:')
for dir_name in sorted(created_dirs):
    print(f'  • {dir_name}')

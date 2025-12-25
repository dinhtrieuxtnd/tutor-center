# Style Guide - Tutor Center Web App

## Nguyên tắc thiết kế

- **Đơn giản & Tối giản**: Ưu tiên nội dung, giảm thiểu trang trí không cần thiết
- **Tối ưu diện tích**: Sử dụng khoảng cách nhỏ gọn, bố cục chặt chẽ
- **Ít bo tròn**: Sử dụng góc vuông hoặc bo tròn nhẹ (rounded-sm, rounded-md)
- **Typography nhỏ gọn**: Ưu tiên text-sm, text-xs cho giao diện quản trị

## Màu sắc

### Màu chính
```jsx
// Background
bg-primary         // #FFFFFF - Nền trắng
bg-primary-dark    // #F8F9FA - Nền xám nhạt
bg-primary-darker  // #E9ECEF - Nền xám đậm hơn

// Text
text-foreground        // #212529 - Chữ đen
text-foreground-light  // #495057 - Chữ xám đậm
text-foreground-lighter // #6C757D - Chữ xám nhạt
```

### Màu xám (Grayscale)
```jsx
bg-gray-50   // #F8F9FA - Rất nhạt
bg-gray-100  // #F1F3F5
bg-gray-200  // #E9ECEF
bg-gray-300  // #DEE2E6
bg-gray-400  // #CED4DA
bg-gray-500  // #ADB5BD
bg-gray-600  // #6C757D
bg-gray-700  // #495057
bg-gray-800  // #343A40
bg-gray-900  // #212529 - Rất đậm
```

### Màu trạng thái
```jsx
// Success - Xanh lá
bg-success          // #10B981
bg-success-bg       // #D1FAE5 - Background nhạt
text-success-text   // #065F46 - Text đậm

// Error - Đỏ
bg-error            // #EF4444
bg-error-bg         // #FEE2E2 - Background nhạt
text-error-text     // #991B1B - Text đậm

// Warning - Vàng
bg-warning          // #F59E0B
bg-warning-bg       // #FEF3C7
text-warning-text   // #92400E

// Info - Xanh dương
bg-info             // #3B82F6
bg-info-bg          // #DBEAFE
text-info-text      // #1E3A8A
```

### Màu border
```jsx
border-border       // #E9ECEF - Border mặc định
border-border-light // #F1F3F5 - Border nhạt
border-border-dark  // #DEE2E6 - Border đậm
```

## Typography

### Font Size (Nhỏ gọn)
```jsx
text-xs    // 0.75rem (12px) - Label, caption
text-sm    // 0.875rem (14px) - Body text chính (ưu tiên)
text-base  // 1rem (16px) - Heading nhỏ
text-lg    // 1.125rem (18px) - Heading
text-xl    // 1.25rem (20px) - Title
text-2xl   // 1.5rem (24px) - Page title
```

### Font Weight
```jsx
font-normal   // 400 - Text thường
font-medium   // 500 - Text nhấn mạnh nhẹ
font-semibold // 600 - Heading, Button
font-bold     // 700 - Title quan trọng
```

## Spacing (Tối ưu diện tích)

### Padding/Margin
```jsx
p-1   // 0.25rem (4px)
p-2   // 0.5rem (8px)   - Padding button nhỏ
p-3   // 0.75rem (12px) - Padding button, card
p-4   // 1rem (16px)    - Padding section
p-6   // 1.5rem (24px)  - Padding container

// Ví dụ
px-3 py-2  // Button compact
px-4 py-3  // Card padding
```

### Gap
```jsx
gap-2  // 0.5rem (8px)   - Các element sát nhau
gap-3  // 0.75rem (12px) - Gap thường dùng
gap-4  // 1rem (16px)    - Gap section
```

## Border Radius (Ít bo tròn)

```jsx
rounded-none // 0px - Góc vuông (ưu tiên cho admin)
rounded-sm   // 0.125rem (2px) - Bo góc nhẹ
rounded      // 0.25rem (4px) - Bo góc vừa
rounded-md   // 0.375rem (6px) - Bo góc trung bình
rounded-lg   // 0.5rem (8px) - Chỉ dùng cho modal, card lớn
```

## Components

### Button
```jsx
// Primary button
<button className="px-3 py-2 bg-foreground text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors">
  Submit
</button>

// Success button
<button className="px-3 py-2 bg-success text-white text-sm font-medium rounded-sm hover:bg-success-dark">
  Save
</button>

// Danger button
<button className="px-3 py-2 bg-error text-white text-sm font-medium rounded-sm hover:bg-error-dark">
  Delete
</button>

// Ghost button
<button className="px-3 py-2 text-foreground text-sm font-medium rounded-sm hover:bg-gray-100 border border-border">
  Cancel
</button>
```

### Input
```jsx
<input 
  className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary"
  placeholder="Enter text..."
/>
```

### Checkbox
```jsx
import { Checkbox } from '@/shared/components/ui';

<Checkbox
  id="remember"
  checked={isChecked}
  onChange={setIsChecked}
  label="Ghi nhớ đăng nhập"
/>
```

### Card
```jsx
<div className="bg-primary border border-border rounded-sm p-4">
  <h3 className="text-base font-semibold mb-2">Card Title</h3>
  <p className="text-sm text-foreground-light">Card content...</p>
</div>
```

### Table
```jsx
<table className="w-full text-sm">
  <thead className="bg-gray-50 border-b border-border">
    <tr>
      <th className="px-3 py-2 text-left font-semibold text-foreground">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-border hover:bg-gray-50">
      <td className="px-3 py-2 text-foreground-light">Data</td>
    </tr>
  </tbody>
</table>
```

### Alert/Notification
```jsx
// Success
<div className="px-4 py-3 bg-success-bg border-l-4 border-success text-sm">
  <p className="text-success-text">Success message</p>
</div>

// Error
<div className="px-4 py-3 bg-error-bg border-l-4 border-error text-sm">
  <p className="text-error-text">Error message</p>
</div>
```

### Badge
```jsx
<span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-sm">
  Active
</span>
```

## Layout

### Container
```jsx
<div className="max-w-7xl mx-auto px-4 py-6">
  {/* Content */}
</div>
```

### Sidebar Layout
```jsx
<div className="flex h-screen">
  {/* Sidebar */}
  <aside className="w-64 bg-primary-dark border-r border-border">
    <nav className="p-4 space-y-1">
      <a className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-100 rounded-sm">
        Menu Item
      </a>
    </nav>
  </aside>
  
  {/* Main content */}
  <main className="flex-1 overflow-auto">
    <div className="p-6">
      {/* Page content */}
    </div>
  </main>
</div>
```

### Grid
```jsx
// 2 columns
<div className="grid grid-cols-2 gap-4">
  {/* Items */}
</div>

// 3 columns
<div className="grid grid-cols-3 gap-3">
  {/* Items */}
</div>
```

## Icons (Lucide React)

### Import
```jsx
import { User, Mail, Lock, Search, Menu, X, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
```

### Kích thước
```jsx
// Size prop - Ưu tiên size nhỏ gọn
<User size={14} />  // 14px - Icon trong text, label
<Mail size={16} />  // 16px - Icon trong button, input (mặc định)
<Menu size={18} />  // 18px - Icon trong navigation
<Plus size={20} />  // 20px - Icon lớn, standalone
```

### Màu sắc
```jsx
// Sử dụng className để set màu
<User className="text-foreground" />
<Mail className="text-foreground-light" />
<Lock className="text-error" />
<Search className="text-success" />
```

### Sử dụng trong components
```jsx
// Button với icon
<button className="px-3 py-2 bg-foreground text-white text-sm font-medium rounded-sm flex items-center gap-2">
  <Plus size={16} />
  Thêm mới
</button>

// Input với icon
<div className="relative">
  <Search size={16} className="absolute left-3 top-2.5 text-foreground-lighter" />
  <input className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-sm" />
</div>

// Icon button
<button className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light">
  <Edit size={16} />
</button>
```

### Icon thường dùng
```jsx
// Navigation & Actions
Menu, X, ChevronRight, ChevronDown, ChevronLeft, Home, Settings

// User & Auth
User, Users, Mail, Lock, LogIn, LogOut, UserPlus

// Content
Plus, Edit, Trash2, Save, FileText, Folder, Search

// Status
Check, X, AlertCircle, Info, HelpCircle

// Media
Image, File, Download, Upload, Eye, EyeOff
```

## Best Practices

1. **Consistency**: Luôn sử dụng các class đã định nghĩa
2. **Spacing**: Ưu tiên gap-2, gap-3, p-3, p-4 cho giao diện chặt chẽ
3. **Font size**: Mặc định dùng text-sm cho body text
4. **Border radius**: Ưu tiên rounded-sm hoặc rounded-none
5. **Colors**: Chỉ dùng màu trong color palette đã định nghĩa
6. **Hover states**: Luôn thêm hover effect cho interactive elements
7. **Border**: Dùng border-border cho consistency
8. **Icons**: Sử dụng lucide-react, ưu tiên size 16px, align với text bằng flex items-center gap-2

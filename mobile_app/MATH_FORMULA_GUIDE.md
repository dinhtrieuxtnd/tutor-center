# Hướng dẫn sử dụng công thức toán học trong Quiz

## Đã cài đặt thư viện `react-native-math-view`

Component `MathText` đã được tạo để tự động render công thức toán học LaTeX.

## Cách nhập công thức trong Backend

Khi tạo câu hỏi hoặc đáp án trong backend, sử dụng cú pháp LaTeX với dấu `$`:

### 1. Inline Math (công thức trong dòng)
Sử dụng `$...$` để wrap công thức:

**Ví dụ:**
```
Phương trình $\sqrt{x + 4} = 3$ có nghiệm là:
```

**Hiển thị:** Phương trình √(x + 4) = 3 có nghiệm là:

### 2. Display Math (công thức riêng biệt)
Sử dụng `$$...$$` để wrap công thức lớn:

**Ví dụ:**
```
Tính giá trị của biểu thức: $$\frac{x^2 + 2x + 1}{x + 1}$$
```

## Các công thức LaTeX thường dùng

### Phân số
```latex
$\frac{1}{2}$              → 1/2
$\frac{a}{b}$              → a/b
$\frac{x^2 + 1}{x - 1}$    → (x² + 1)/(x - 1)
```

### Căn bậc hai
```latex
$\sqrt{x}$                 → √x
$\sqrt{x + 4}$             → √(x + 4)
$\sqrt[3]{27}$             → ³√27 (căn bậc 3)
```

### Mũ và chỉ số
```latex
$x^2$                      → x²
$x^{2n}$                   → x^(2n)
$a_1$                      → a₁
$x_{n-1}$                  → x_(n-1)
```

### Tập hợp
```latex
$A \cup B$                 → A ∪ B (hợp)
$A \cap B$                 → A ∩ B (giao)
$A \subset B$              → A ⊂ B
$\{1, 2, 3\}$              → {1, 2, 3}
$\emptyset$                → ∅ (tập rỗng)
```

### So sánh và logic
```latex
$x \leq y$                 → x ≤ y
$x \geq y$                 → x ≥ y
$x \neq y$                 → x ≠ y
$\forall x$                → ∀x (với mọi x)
$\exists x$                → ∃x (tồn tại x)
```

### Tam giác và góc
```latex
$\alpha$                   → α (alpha)
$\beta$                    → β (beta)
$\triangle ABC$            → △ABC
$90^\circ$                 → 90°
$\sin$, $\cos$, $\tan$     → sin, cos, tan
```

## Ví dụ câu hỏi hoàn chỉnh

### Câu hỏi 1: Phân số
```
Tính giá trị của biểu thức: $\frac{1}{2} + \frac{3}{4} = ?$

Cho biểu thức: $\frac{x^2 + 2x + 1}{x + 1}$

Với $x \neq -1$, $\alpha = 45^\circ$, $\beta = 30^\circ$

Kết quả là:
```

**Đáp án:**
```
$\frac{5}{4}$ (hoặc 1.25)
$\frac{7}{8}$ (hoặc 0.875)
$\frac{1}{4}$ (hoặc 0.25)
$\frac{3}{2}$ (hoặc 1.5)
```

### Câu hỏi 2: Phương trình căn
```
Phương trình $\sqrt{x + 4} = 3$ có nghiệm là:

Biết rằng: $x \in \mathbb{R}$, $x \geq -4$
```

**Đáp án:**
```
$x = 5$
$x = 9$
$x = -4$
Vô nghiệm
```

### Câu hỏi 3: Tập hợp
```
Cho tập hợp $A = \{1, 2, 3\}$ và $B = \{2, 3, 4\}$

Tìm $A \cap B$ (giao của A và B):

Biết: $A \cup B = \{1, 2, 3, 4\}$
      $A \cap B = \{...\}$
      $|A| = 3$, $|B| = 3$
```

**Đáp án:**
```
$\{2, 3\}$
$\{1, 2, 3, 4\}$
$\{1\}$
$\emptyset$ (tập rỗng)
```

## Lưu ý khi nhập

1. **Luôn đóng dấu `$`**: Mỗi công thức phải có cặp `$...$` hoặc `$$...$$`
2. **Dấu ngoặc nhọn `{}`**: Dùng cho biểu thức nhiều ký tự (ví dụ: `x^{2n}` chứ không phải `x^2n`)
3. **Ký tự đặc biệt**: Cần escape `\` trước các lệnh LaTeX (`\frac`, `\sqrt`, v.v.)
4. **Test trước**: Nên test câu hỏi trên app trước khi deploy

## Công cụ test LaTeX online

- [LaTeX Equation Editor](https://www.codecogs.com/latex/eqneditor.php)
- [Overleaf](https://www.overleaf.com/)
- [Math Live](https://cortexjs.io/mathlive/)

## Troubleshooting

### Nếu công thức không hiển thị:
1. Kiểm tra đã có cặp `$...$` bao quanh công thức
2. Kiểm tra cú pháp LaTeX đúng
3. Restart app Expo: `r` trong terminal
4. Clear cache: `expo start -c`

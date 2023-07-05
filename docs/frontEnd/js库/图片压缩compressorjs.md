# 图片压缩compressorjs

git地址  (https://github.com/fengyuanchen/compressorjs)

我们在调后台接口上传图片时，经常会遇到图片太大无法上传的情况，现在手机拍摄的照片越来越高清，一张图片可达到`10M`大小，所以为了缓解服务器压力和优化上传速度，我们必须将图片压缩后上传。

`compressorjs`是一个对图片压缩的工具类

## 下载

`npm install compressorjs`



## 使用

`new Compressor(file[, options])`

| 参数    | 类型      | 描述           |
| ------- | --------- | -------------- |
| file    | File/Blob | 需要压缩的图片 |
| options | Object    | 可选参数       |



## 示例

```js
import axios from 'axios';
import Compressor from 'compressorjs';

document.getElementById('file').addEventListener('change', (e) => {
  const file = e.target.files[0];

  if (!file) {
    return;
  }

  new Compressor(file, {
    // 压缩比例
    quality: 0.6,
	// 压缩成功回调
    success(result) {
      const formData = new FormData();

      // The third parameter is required for server
      formData.append('file', result, result.name);

      // Send the compressed image file to server with XMLHttpRequest.
      axios.post('/path/to/upload', formData).then(() => {
        console.log('Upload success');
      });
    },
    // 压缩失败
    error(err) {
      console.log(err.message);
    },
  });
});
```



## 可选参数options

### quality

- Type: `number`
- Default: `0.8`

压缩的程度。它必须是一个在' 0 '和' 1 '之间的数字。如果此参数是其他参数，则默认值' 0.92 '和' 0.80 '分别用于' `image/jpeg` '和' `image/webp` '。其他参数被忽略。小心使用“1”，因为它可能会使输出图像的大小变大。

注意:此选项仅适用于图像/`jpeg`和图像/`webp`图像。

**Examples**:

| Quality | Input size | Output size | Compression ratio | Description   |
| ------- | ---------- | ----------- | ----------------- | ------------- |
| 0       | 2.12 MB    | 114.61 KB   | 94.72%            | -             |
| 0.2     | 2.12 MB    | 349.57 KB   | 83.90%            | -             |
| 0.4     | 2.12 MB    | 517.10 KB   | 76.18%            | -             |
| 0.6     | 2.12 MB    | 694.99 KB   | 67.99%            | Recommend     |
| 0.8     | 2.12 MB    | 1.14 MB     | 46.41%            | Recommend     |
| 1       | 2.12 MB    | 2.12 MB     | 0%                | Not recommend |
| NaN     | 2.12 MB    | 2.01 MB     | 5.02%             |               |

### strict

- Type: `boolean`
- Default: `true`

当压缩图像的大小大于原始图像时，是否输出原始图像而不是压缩图像，以下情况除外:

- -设置了“`mimeType`”选项，并且它的值与图像的mime类型不同。
- -“宽度”选项已设置，其值大于图像的自然宽度。
- -设置了“height”选项，其值大于图像的自然高度。
- -“`minWidth`”选项被设置，其值大于图像的自然宽度。
- -“`minHeight`”选项被设置，其值大于图像的自然高度。

### checkOrientation

- Type: `boolean`
- Default: `true`

指示是否读取图像的`Exif`方向值(仅为`JPEG`图像)，然后随该值自动旋转或翻转图像。

**注释:**

- -不要总是相信这一点，因为一些`JPEG`图像的方向值不正确(不是标准的)。
- -如果目标图像的大小太大(例如，大于`10mb`)，你应该禁用这个选项，以避免内存不足的崩溃。
- -图像的`Exif`信息将被删除后压缩，所以如果你需要`Exif`信息，你可能需要上传原始图像以及。

### maxWidth

- Type: `number`
- Default: `Infinity`

输出图像的最大宽度。该值应大于“0”。

> 为了避免得到一个空白的输出图像，您可能需要将' `maxWidth `'和' `maxHeight `'选项设置为有限的数字，因为[画布元素的大小限制](https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element)，建议使用' 4096 '或更少。

### maxHeight

- Type: `number`
- Default: `Infinity`

输出图像的最大高度。该值应大于“0”。

### minWidth

- Type: `number`
- Default: `0`

输出图像的最小宽度。该值应该大于' 0 '并且不应该大于' `maxWidth `'。

### minHeight

- Type: `number`
- Default: `0`

输出图像的最小高度。该值应大于' 0 '且不应大于' `maxHeight `'。

### width

- Type: `number`
- Default: `undefined`

输出图像的宽度。如果没有指定，将使用原始图像的自然宽度，或者如果设置了' height '选项，宽度将根据自然长宽比自动计算。

### height

- Type: `number`
- Default: `undefined`

输出图像的高度。如果未指定，将使用原始图像的自然高度，或者如果设置了' width '选项，高度将根据自然长宽比自动计算。

### mimeType

- Type: `string`
- Default: `'auto'`

输出图像的mime类型。默认情况下，将使用源图像文件的原始mime类型。

### convertSize

- Type: `number`
- Default: `5000000` (5 MB)

超过这个值的PNG文件将被转换成jpeg。要禁用此功能，只需将值设置为“Infinity”。

**Examples**:

| convertSize | Input size (type) | Output size (type) | Compression ratio |
| ----------- | ----------------- | ------------------ | ----------------- |
| 5 MB        | 1.87 MB (`PNG`)   | 1.87 MB (`PNG`)    | 0%                |
| 5 MB        | 5.66 MB (`PNG`)   | 450.24 KB (`JPEG`) | 92.23%            |
| 5 MB        | 9.74 MB (`PNG`)   | 883.89 KB (`JPEG`) | 91.14%            |

### beforeDraw(context, canvas)

- Type: `Function`
- Default: `null`
- Parameters:
  - `context`: 画布的`2d`渲染上下文
  - `canvas`: 用于压缩的画布

在将图像绘制到画布进行压缩之前要执行的钩子函数。

```
new Compressor(file, {
  beforeDraw(context, canvas) {
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.filter = 'grayscale(100%)';
  },
});
```

### drew(context, canvas)

- Type: `Function`
- Default: `null`
- Parameters:
  - `context`: 画布的`2d`渲染上下文。
  - `canvas`: 用于压缩的画布。

将图像绘制到画布以进行压缩后执行的钩子函数。

```
new Compressor(file, {
  drew(context, canvas) {
    context.fillStyle = '#fff';
    context.font = '2rem serif';
    context.fillText('watermark', 20, canvas.height - 20);
  },
});
```

### success(result)

- Type: `Function`
- Default: `null`
- Parameters:
  - `result`: 被压缩的图片 (File或Blob对象).

当压缩图片成功时执行的钩子函数。

The hook function to execute when success to compress the image.

### error(err)

- Type: `Function`
- Default: `null`
- Parameters:
  - `err`: 压缩错误 (一个' error '对象).

当压缩图片失败时执行的钩子函数。





#### success返回Blob对象，如果接口 不接受Blob，那么将Blob转换成File

// result 是一个Blob对象

`const file = new window.File([result], result.name, { type: result.type })`
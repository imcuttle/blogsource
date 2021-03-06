---
title: 「图像处理」图像的复原
datetime: 2016-06-03 15:58:25
categories: [其他]
tags: [图像处理]
cover: 
---

# 介绍
图像在形成、记录、处理和传输过程中，由于成像系统、记录设备、传输介质和处理方法的问题，导致图像质量下降，这种现象叫图像退化。
而图像复原就是对退化的图像进行处理，尽可能的复原图像的**本来面目**。
<!--more-->
如图，先对图片进行模糊处理
<img src="http://obu9je6ng.bkt.clouddn.com/FkLD1OdGi0WKdv26sK4ubCj3ov6B?imageslim" alt="ClipboardImage" width="530" height="330" />
然后对图片进行还原
<img src="http://obu9je6ng.bkt.clouddn.com/FqQpRZv_Tzx54uHAREg7O9UPY8r3?imageslim" alt="ClipboardImage" width="530" height="330" />

# 代码解释

```java
    //图像恢复
	public int[] imRestore(int[] pixels, int iw, int ih)
	{
		double[] newPixels = new double [iw*ih];
		double[] newKernel = new double [iw*ih];

		//初始化
		for(int j = 0; j < ih; j++)
		{
			for(int i = 0; i < iw; i++)
			{
				newPixels[i+j*iw] = pixels[i+j*iw]&0xff;
				if((i<5) && (j<5))
					newKernel[i+j*iw] = 1.0/25;
				else
					newKernel[i+j*iw] = 0;
			}
		}

		//初始化
		Complex[] complex   = new Complex[iw*ih];
		Complex[] comKernel = new Complex[iw*ih];
		for(int i = 0;i < iw*ih; i++)
		{
			complex[i]   = new Complex(0,0);
			comKernel[i] = new Complex(0,0);
		}

		//对原图像进行FFT (快速傅氏变换)
		fft2 = new FFT2();
		fft2.setData2(iw, ih, newPixels);
		complex = fft2.getFFT2();

		//对卷积核进行FFT
		fft2 = new FFT2();
		fft2.setData2(iw, ih, newKernel);
		comKernel = fft2.getFFT2();

		//逆滤波复原
		for(int j = 0;j < ih; j++)
		{
			for(int i = 0; i < iw; i++)
			{
				double re = complex[i+j*iw].re;
				double im = complex[i+j*iw].im;
				double reKernel = comKernel[i+j*iw].re;
				double imKernel = comKernel[i+j*iw].im;
				double x = reKernel*reKernel+imKernel*imKernel;

				if(x > 1e-3)
				{
					double r = (re*reKernel+im*imKernel)/x;
					double m = (im*reKernel-re*imKernel)/x;
					complex[i+j*iw].re = r;
					complex[i+j*iw].im = m;
				}
			}
		}

		//进行FFT反变换
		fft2 = new FFT2();
		fft2.setData2i(iw, ih, complex);
		pixels = fft2.getPixels2i();
		return pixels;
	}
```


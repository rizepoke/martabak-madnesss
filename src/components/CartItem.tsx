'use client'
import { CartItemType, Product } from '@/config/type'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/utils/store'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CartItem = ({ product }: { product: CartItemType }) => {
  const { image } = product
  const { removeFromCart } = useCartStore()


  console.log(image)
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            {image ? (
              <Image
                src={image}
                alt={product.title}
                width={64}
                height={64}
                className="absolute object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <Link href={`/product/${product.id}`} className='hover:opacity-70'>
              <span className="line-clamp-1 text-sm font-medium mb-1">
                {product.title}
              </span>
            </Link>
            <Link href={`/product/${product.id}`} className='hover:opacity-70'>
              <span className="line-clamp-1 text-xs text-muted-foreground">
                {product.quantity} x {formatPrice(product.price)}
              </span>
            </Link>
            <div className="mt-2 text-xs text-muted-foreground">
              <button
                onClick={() => removeFromCart({
                  id: product.id,
                  price: product.price,
                  quantity: 1,
                  title: product.title,
                  image: product.image,
                })}
                className="flex items-center gap-1 group"
              >
                <X className="w-3 h-3 flex-shrink-0 group-hover:opacity-80" />
                <span className="group-hover:opacity-80">Remove</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price * product.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartItem
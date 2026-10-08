// src/utils/comprovanteStorageService.js
// Serviço de Otimização e Armazenamento de Comprovantes Digitais (Cofre Sem Papel)
// Comprime fotos pesadas do celular (5MB -> ~80KB) usando Canvas antes do upload
// Salva no Supabase Storage (bucket 'comprovantes') com fallback seguro

import { supabase } from '../lib/supabase';

/**
 * Comprime uma imagem no navegador antes de enviar para a nuvem
 * Reduz a resolução máxima para 1600px e comprime em WebP/JPEG qualidade 0.8
 * @param {File|Blob} file 
 * @returns {Promise<{ blob: Blob, dataUrl: string, originalSize: number, compressedSize: number }>}
 */
export async function comprimirImagemComprovante(file) {
  return new Promise((resolve, reject) => {
    // Se for PDF, não tenta desenhar no canvas (mantém o PDF original)
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          blob: file,
          dataUrl: e.target.result,
          originalSize: file.size,
          compressedSize: file.size,
          isPdf: true,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const maxDim = 1600;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Tenta primeiro WebP (mais compacto); se falhar, usa JPEG
      let mimeType = 'image/webp';
      let quality = 0.82;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Fallback para JPEG
            canvas.toBlob(
              (jpegBlob) => {
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve({
                  blob: jpegBlob || file,
                  dataUrl,
                  originalSize: file.size,
                  compressedSize: jpegBlob ? jpegBlob.size : file.size,
                  isPdf: false,
                });
              },
              'image/jpeg',
              0.8
            );
            return;
          }

          const dataUrl = canvas.toDataURL(mimeType, quality);
          resolve({
            blob,
            dataUrl,
            originalSize: file.size,
            compressedSize: blob.size,
            isPdf: false,
          });
        },
        mimeType,
        quality
      );
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Falha ao processar imagem para compressão: ' + e));
    };

    img.src = url;
  });
}

/**
 * Envia o comprovante para o Supabase Storage
 * @param {Object} params
 * @param {File} params.file
 * @param {string} params.empresaId
 * @param {string} [params.lancamentoId]
 * @returns {Promise<{ ok: boolean, url: string, tamanhoOriginal: number, tamanhoFinal: number }>}
 */
export async function uploadComprovanteStorage({ file, empresaId, lancamentoId }) {
  if (!file) throw new Error('Nenhum arquivo informado.');

  const empId = empresaId || 'geral';
  const timestamp = Date.now();

  // 1. Comprime a imagem localmente (no celular/PC do cliente)
  const otimizado = await comprimirImagemComprovante(file);

  const extensao = otimizado.isPdf ? 'pdf' : 'webp';
  const nomeArquivo = `${empId}/${timestamp}_${lancamentoId || 'novo'}.${extensao}`;

  // 2. Tenta fazer upload no Supabase Storage
  try {
    const { data, error } = await supabase.storage
      .from('comprovantes')
      .upload(nomeArquivo, otimizado.blob, {
        contentType: otimizado.isPdf ? 'application/pdf' : 'image/webp',
        upsert: true,
      });

    if (!error && data?.path) {
      const { data: pubData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(data.path);

      return {
        ok: true,
        url: pubData?.publicUrl || otimizado.dataUrl,
        storagePath: data.path,
        tamanhoOriginal: otimizado.originalSize,
        tamanhoFinal: otimizado.compressedSize,
      };
    }

    console.warn('Storage upload warning:', error?.message);
  } catch (eStorage) {
    console.warn('Falha no upload do Supabase Storage, usando fallback em cache:', eStorage);
  }

  // 3. Fallback seguro: se o bucket não estiver criado ainda, usa dataUrl otimizado
  return {
    ok: true,
    url: otimizado.dataUrl,
    tamanhoOriginal: otimizado.originalSize,
    tamanhoFinal: otimizado.compressedSize,
    fallback: true,
  };
}

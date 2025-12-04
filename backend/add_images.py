from eventos_app.models import Evento

eventos = Evento.objects.all()
count = 0

for e in eventos:
    if not e.imagem:
        if 'show' in e.nome.lower() or e.categoria == 'show':
            e.imagem = 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=900&q=80'
        elif 'teatro' in e.nome.lower() or e.categoria == 'teatro':
            e.imagem = 'https://images.unsplash.com/photo-1515165562835-c4c9e0737eaa?auto=format&fit=crop&w=900&q=80'
        elif 'palestra' in e.nome.lower() or e.categoria == 'palestra':
            e.imagem = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'
        else:
            e.imagem = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80'
        e.save()
        count += 1

print(f'Atualizados {count} eventos com imagens')

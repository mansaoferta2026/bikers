import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Eye, EyeOff, Upload, Loader2, Save } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { carouselService, type CarouselSlide } from '../../../services/carousel';

export const LandingContentTab = () => {
    const [loading, setLoading] = useState(true);
    const [slides, setSlides] = useState<CarouselSlide[]>([]);
    const [editingSlide, setEditingSlide] = useState<Partial<CarouselSlide> | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadSlides();
    }, []);

    const loadSlides = async () => {
        try {
            setLoading(true);
            const data = await carouselService.getAll();
            setSlides(data);
        } catch (error) {
            console.error('Error loading carousel slides:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSlide = () => {
        setEditingSlide({
            title: '',
            subtitle: '',
            image_url: '',
            cta_text: '',
            cta_link: '',
            is_active: true,
        });
        setShowForm(true);
    };

    const handleEditSlide = (slide: CarouselSlide) => {
        setEditingSlide(slide);
        setShowForm(true);
    };

    const handleSaveSlide = async () => {
        if (!editingSlide) return;

        try {
            if ('id' in editingSlide && editingSlide.id) {
                // Update existing
                await carouselService.update(editingSlide.id, editingSlide);
            } else {
                // Create new
                await carouselService.create(editingSlide as any);
            }

            await loadSlides();
            setShowForm(false);
            setEditingSlide(null);
        } catch (error) {
            console.error('Error saving slide:', error);
            alert('Error al guardar el slide');
        }
    };

    const handleDeleteSlide = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este slide?')) return;

        try {
            await carouselService.delete(id);
            await loadSlides();
        } catch (error) {
            console.error('Error deleting slide:', error);
            alert('Error al eliminar el slide');
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        try {
            await carouselService.toggleActive(id, !isActive);
            await loadSlides();
        } catch (error) {
            console.error('Error toggling slide:', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // TODO: Implement Supabase Storage upload
        // For now, just use a placeholder URL
        const reader = new FileReader();
        reader.onloadend = () => {
            if (editingSlide) {
                setEditingSlide({
                    ...editingSlide,
                    image_url: reader.result as string,
                });
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Carrusel de la Landing Page</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Gestiona las imágenes y contenido del carrusel principal
                    </p>
                </div>
                <Button onClick={handleCreateSlide} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Slide
                </Button>
            </div>

            {/* Slides List */}
            <div className="space-y-4">
                {slides.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-600 mb-4">No hay slides en el carrusel</p>
                        <Button onClick={handleCreateSlide} variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Primer Slide
                        </Button>
                    </div>
                ) : (
                    slides.map((slide) => (
                        <div
                            key={slide.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4"
                        >
                            {/* Drag Handle */}
                            <div className="cursor-move text-gray-400">
                                <GripVertical className="h-5 w-5" />
                            </div>

                            {/* Image Preview */}
                            <div className="w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {slide.image_url ? (
                                    <img
                                        src={slide.image_url}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{slide.title}</h4>
                                {slide.subtitle && (
                                    <p className="text-sm text-gray-600 truncate">{slide.subtitle}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-xs text-gray-500">
                                        Orden: {slide.display_order}
                                    </span>
                                    {slide.cta_text && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            CTA: {slide.cta_text}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleToggleActive(slide.id, slide.is_active)}
                                    className={`p-2 rounded-lg transition-colors ${slide.is_active
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                    title={slide.is_active ? 'Activo' : 'Inactivo'}
                                >
                                    {slide.is_active ? (
                                        <Eye className="h-4 w-4" />
                                    ) : (
                                        <EyeOff className="h-4 w-4" />
                                    )}
                                </button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditSlide(slide)}
                                >
                                    Editar
                                </Button>
                                <button
                                    onClick={() => handleDeleteSlide(slide.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit/Create Form Modal */}
            {showForm && editingSlide && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold">
                                {'id' in editingSlide ? 'Editar Slide' : 'Nuevo Slide'}
                            </h3>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    {editingSlide.image_url ? (
                                        <div className="relative">
                                            <img
                                                src={editingSlide.image_url}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded"
                                            />
                                            <button
                                                onClick={() => setEditingSlide({ ...editingSlide, image_url: '' })}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block text-center">
                                            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600">
                                                Click para subir imagen
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    value={editingSlide.title || ''}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Subtitle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subtítulo
                                </label>
                                <input
                                    type="text"
                                    value={editingSlide.subtitle || ''}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* CTA Text */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Texto del Botón (CTA)
                                    </label>
                                    <input
                                        type="text"
                                        value={editingSlide.cta_text || ''}
                                        onChange={(e) => setEditingSlide({ ...editingSlide, cta_text: e.target.value })}
                                        placeholder="Ej: Ver Eventos"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                {/* CTA Link */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enlace del Botón
                                    </label>
                                    <input
                                        type="text"
                                        value={editingSlide.cta_link || ''}
                                        onChange={(e) => setEditingSlide({ ...editingSlide, cta_link: e.target.value })}
                                        placeholder="/events"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingSlide(null);
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button onClick={handleSaveSlide} className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

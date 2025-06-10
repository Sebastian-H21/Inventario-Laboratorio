<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table-> engine = 'innoDB';
            $table->id();
            $table->string('codigo', 10)->unique(); 
            $table->string('nombre', 30);
            $table->integer('cantidad');
            $table->string('observaciones', 50);
            $table->string('modelo', 50);
            $table->foreignId('id_marca')->constrained('marcas');
            $table->foreignId('id_categoria')->constrained('categorias');
            $table->foreignId('id_ubicacion')->constrained('ubicacions');
            $table->foreignId('id_laboratorio')->constrained('laboratorios');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};

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
        Schema::create('prestamos', function (Blueprint $table) {
            $table-> engine = 'innoDB';
            $table->id();
            $table->datetime('fecha_prestamo');
            $table->datetime('fecha_devolucion');
            $table->unsignedBigInteger('id_estudiante');
            $table->string('id_maestro');
            $table->unsignedBigInteger('id_material');
            $table->string('estado', 11); //se refiere al estado del prestamo completo, incompleto, en proceso
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('id_estudiante')->references('id')->on('estudiantes');
            $table->foreign('id_maestro')->references('rfc')->on('maestros');
            $table->foreign('id_material')->references('id')->on('materials');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamos');
    }
};
